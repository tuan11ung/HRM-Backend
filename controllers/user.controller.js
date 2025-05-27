
const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const User = db.user;
const Op = require('sequelize').Op

var bcrypt = require("bcryptjs");

exports.get_information = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId, {
            include: [{
                model: db.position,
                as: 'position'
            }, {
                model: db.level,
                as: 'level'
            }]
        });
        return res.status(200).send({
            message: "Lấy thông tin user thành công",
            user: user
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.get_all_user = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).send({
            message: "Lấy danh sách user thành công",
            users: users
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}


exports.get_user_by_id = async (req, res) => {
    try {
        const userId = req.params.id;
    if (!userId) {
        return res.status(404).send({
            message: "User id is required"
        });
    }

    var user = await User.findByPk(userId);
    if (user) {
        return res.status(200).send({
            user: user,
        });
    } else {
        return res.status(404).send({
            message: "Cannot find user"
        });
    }

    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.create_new_user = async (req, res) => {
    const position_id = req.body.position_id;
    const level_id = req.body.level_id;
    const email = req.body.email;
    const mobile_phone = req.body.mobile_phone;
    const name = req.body.name;
    const password = req.body.password;
    

    try {
        if (!position_id || !level_id || !email || !mobile_phone || !password || !name) {
            return res.status(403).send({
                message: "Vui lòng nhập thông tin"
            })
        } 
        var existUser = await User.findOne({ 
            where: {
                [Op.or]: [{email: email}, {mobile_phone: mobile_phone}]
              }
            });
        if (existUser) {
            return res.status(403).send({
                message: "Tài khoản đã tồn tại"
            })
        }
        else {
            await User.create({ name: name, position_id: position_id, level_id: level_id, email : email, mobile_phone : mobile_phone, password: bcrypt.hashSync(req.body.password, 8) });
            return res.status(200).send({
                message: "Tạo User thành công"
            })
        }

    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.update_user = async (req, res) => {
    const address = req.body.address;
    const birthday = req.body.birthday;
    const email = req.body.email;
    const mobile_phone = req.body.mobile_phone;
    const avatar = req.body.avatar;

    const user_id = req.userId;

    try {
        if (!address && !birthday && !email && !mobile_phone && !avatar) {
            return res.status(500).send({
                message: "Required at least one params"
            }); 
        }
        const update_user = await User.findByPk(user_id);
        if (!update_user) return res.status(404).send({
            message: "Không tìm thấy User!"
        });

        await update_user.update({
            address: address || update_user.address,
            birthday: birthday || update_user.birthday,
            email: email || update_user.email,
            mobile_phone: mobile_phone || update_user.mobile_phone,
            avatar: avatar || update_user.avatar
        })

        await update_user.save();

        return res.status(201).send({
            message: "Update thành công"
        });

    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.update_user_for_admin = async (req, res) => {
    const user_id = req.params.id;
    const position_id = req.body.position_id;
    const level_id = req.body.level_id;
    const email = req.body.email;
    const mobile_phone = req.body.mobile_phone;
    const name = req.body.name;
    const address = req.body.address;
    const birthday = req.body.birthday;
    const new_password = req.body.password;

    try {
        if (!position_id && !level_id && !email && !mobile_phone && !name && !address && !birthday && !avatar) {
            return res.status(403).send({
                message: "Vui lòng nhập thông tin"
            });
        }
        const update_user = await User.findByPk(user_id);
        if (!update_user) return res.status(404).send({
            message: "Không tìm thấy User!"
        });

        await update_user.update({
            position_id: position_id || update_user.position_id,
            level_id: level_id || update_user.level_id,
            email: email || update_user.email,
            mobile_phone: mobile_phone || update_user.mobile_phone,
            name: name || update_user.name,
            address: address || update_user.address,
            birthday: birthday || update_user.birthday,
            password: new_password ? bcrypt.hashSync(new_password, 8) : update_user.password
        })

        await update_user.save();

        return res.status(201).send({
            message: "Update thành công"
        });

    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}


exports.get_active_users = async (req, res) => {
    try {
        // Lấy ngày hiện tại ở định dạng YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        // Tìm tất cả user đã check-in và chưa check-out trong ngày hiện tại
        const activeUsers = await User.findAll({
            include: [{
                model: db.attendance, // Giả sử bạn đã định nghĩa mối quan hệ giữa User và Attendance
                as: 'attendances',
                where: {
                    date: today, // Lọc theo ngày hiện tại
                    time_out: null // Chưa check-out
                },
                required: true // Chỉ lấy user có bản ghi attendance thỏa mãn
            },
            {
                model: db.position,
                as: 'position'
            }, {
                model: db.level,
                as: 'level'
            }]
        });

        // Kiểm tra và trả về kết quả
        if (activeUsers.length > 0) {
            return res.status(200).send({
                users: activeUsers,

            });
        } else {
            return res.status(201).send({
                message: "Không tìm thấy user nào đang làm việc"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
};