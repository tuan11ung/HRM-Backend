const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const Vacation = db.vacation;
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
    try {
        const vacations = await Vacation.findAll();
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
            const { error } = vacationSchema.validate(req.body);
            if (error) {
                return res.status(400).send({
                    message: error.details[0].message
                });
            }
            await vacation.update({
                status: 'Approve',
            });
            await vacation.save();
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
            const { error } = vacationSchema.validate(req.body);
            if (error) {
                return res.status(400).send({
                    message: error.details[0].message
                });
            }
            await vacation.update({
                status: 'Reject',
            });
            await vacation.save();
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