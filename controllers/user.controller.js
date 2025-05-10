
const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const User = db.user;
const Op = require('sequelize').Op

var bcrypt = require("bcryptjs");

exports.test = async (req, res) => {
    const userId = req.query.user_id;
    const email = req.body.email;
    const password = req.body.password;
    return res.status(200).send({
        userId: userId,
        email: email,
        password: password,
        token: token,
    })
}

exports.get_all_user = async (req, res) => {
    // const allUser = await equelize.query('Select * from user"');

    return res.status(200).send({
        user: allUser
    })
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
    const email = req.body.email;
    const mobile_phone = req.body.mobile_phone;
    const name = req.body.name;
    const address = req.body.address;
    const image = req.body.image;
    const birthday = req.body.birthday;
    const password = req.body.password;

    try {
        if (!position_id || !email || !mobile_phone || !password || !name) {
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
            await User.create({ name: name, position_id: position_id, email : email, mobile_phone : mobile_phone, password: bcrypt.hashSync(req.body.password, 8) });
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

    const user_id = req.userId;

    try {
        if (!address && !birthday && !email && !mobile_phone) {
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
            mobile_phone: mobile_phone || update_user.mobile_phone
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