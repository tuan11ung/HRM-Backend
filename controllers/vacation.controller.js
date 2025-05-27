const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const Vacation = db.vacation;
const Notification = db.notification;
const User = db.user;
const Joi = require('joi');

const vacationSchema = Joi.object({
    request_type: Joi.string().valid('Vacation', 'Sick Leave', 'Work Remotely').required(),
    start_day: Joi.date().required(),
    end_day: Joi.date().required(),
    start_hour: Joi.string().optional(),
    end_hour: Joi.string().optional(),
    status: Joi.string().valid('Pending', 'Approve', 'Reject').default('Pending'),
    comment: Joi.string().optional(),
  });

exports.create_vacation = async (req, res) => {
    try {
        const { error } = vacationSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                message: error.details[0].message
            });
        }

        const vacation = await Vacation.create({
            request_type: req.body.request_type,
            user_id: req.userId,
            start_day: req.body.start_day,
            end_day: req.body.end_day,
            start_hour: req.body.start_hour,
            end_hour: req.body.end_hour,
            status: 'Pending',
            comment: req.body.comment
        });
        const listAdmin = await User.findAll({
            where: {
                role: 'Admin'
            }
        });
        listAdmin.forEach(async (admin) => {
            await Notification.create({
                from_user_id: req.userId,
                to_user_id: admin.id,
                title: "Yêu cầu nghỉ phép",
                content: "Yêu cầu nghỉ phép đã được gửi đến bạn",
            });
        });
        return res.status(200).send({
            message: "Tạo Vacation thành công",
            vacation: vacation
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.get_all_vacation = async (req, res) => {
    const userId = req.userId;
    try {
        const vacations = await Vacation.findAll({
            where: {
                user_id: userId
            }
        });
        return res.status(200).send({
            message: "Lấy danh sách vacation thành công",
            vacations: vacations
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.get_all_vacation_by_admin = async (req, res) => {
    try {
        // Check if user is an admin
        const user = await User.findByPk(req.userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).send({
                message: "Bạn không có quyền thực hiện thao tác này"
            });
        }

        const vacations = await Vacation.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'avatar']
            }]
        });
        return res.status(200).send({
            message: "Lấy danh sách vacation thành công",
            vacations: vacations
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.get_vacation_by_id = async (req, res) => { 
    try {
        const vacation = await Vacation.findByPk(req.params.id);
        if (!vacation) {
            return res.status(404).send({ 
                message: 'Không tìm thấy yêu cầu nghỉ phép' 
            });
        }
        res.status(200).send({vacation : vacation});
    } catch (err) {
        res.status(500).send({ 
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.approve_vacation = async (req, res) => {
    try {
       const vacationId = req.params.id;
       const vacation = await Vacation.findByPk(vacationId);
         if (!vacation) {
              return res.status(404).send({
                message: "Không tìm thấy yêu cầu nghỉ phép"
              });
         }
         else {
            await vacation.update({
                status: 'Approve',
            });
            await vacation.save();
            await Notification.create({
                from_user_id: req.userId,
                to_user_id: vacation.user_id,
                title: "Yêu cầu nghỉ phép",
                content: "Yêu cầu nghỉ phép đã được phê duyệt",
            });
            return res.status(200).send({
                message: "Phê duyệt yêu cầu nghỉ phép thành công",
                vacation: vacation
            });
         }
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.decline_vacation = async (req, res) => {
    try {
       const vacationId = req.params.id;
       const vacation = await Vacation.findByPk(vacationId);
         if (!vacation) {
              return res.status(404).send({
                message: "Không tìm thấy yêu cầu nghỉ phép"
              });
         }
         else {
            // No need for validation when declining
            await vacation.update({
                status: 'Reject',
            });
            await vacation.save();
            await Notification.create({
                from_user_id: req.userId,
                to_user_id: vacation.user_id,
                title: "Yêu cầu nghỉ phép",
                content: "Yêu cầu nghỉ phép đã bị từ chối",
            });
            return res.status(200).send({
                message: "Từ chối yêu cầu nghỉ phép thành công",
                vacation: vacation
            });
         }
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.delete_vacation = async (req, res) => {
    try {
        const vacationId = req.params.id;
        const vacation = await Vacation.findByPk(vacationId);
        if (!vacation) {
            return res.status(404).send({
                message: "Không tìm thấy yêu cầu nghỉ phép"
            });
        }

        if (vacation.status !== 'Pending') {
            await vacation.destroy();
            return res.status(200).send({
                message: "Xóa yêu cầu nghỉ phép thành công"
            });
        }
        else {
            return res.status(400).send({
                message: "Không thể xóa yêu cầu nghỉ phép đã được phê duyệt"
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.update_pending_vacation = async (req, res) => {
    try {
        const vacationId = req.params.id;
        const vacation = await Vacation.findByPk(vacationId);
        if (!vacation) {
            return res.status(404).send({
                message: "Không tìm thấy yêu cầu nghỉ phép"
            });
        }
        if (vacation.status !== 'Pending') {
            return res.status(400).send({
                message: "Không thể cập nhật yêu cầu nghỉ phép đã được phê duyệt"
            });
        }
        const { error } = vacationSchema.validate(req.body);
        if (error) {
            return res.status(400).send({
                message: error.details[0].message
            });
        }
        await vacation.update({
            request_type: req.body.request_type || vacation.request_type,
            user_id: req.userId || vacation.user_id,
            start_day: req.body.start_day || vacation.start_day,
            end_day: req.body.end_day || vacation.end_day,
            start_hour: req.body.start_hour || vacation.start_hour,
            end_hour: req.body.end_hour || vacation.end_hour,
            comment: req.body.comment || vacation.comment
        });
        await vacation.save();
        return res.status(200).send({
            message: "Cập nhật yêu cầu nghỉ phép thành công",
            vacation: vacation
        });
    } catch (err) {
        console.log(err);   
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}