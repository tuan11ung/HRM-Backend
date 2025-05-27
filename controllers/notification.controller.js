const db = require("../models");
const { Sequelize, DataTypes, where } = require('sequelize');
const notification = db.notification;

exports.get_all_notification = async (req, res) => {
    const userId = req.userId;
    try {
        const notifications = await notification.findAll({
            where: {
                to_user_id: userId
            },
            include: [{
                model: db.user,
                as: 'sender'
            }],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).send({
            message: "Lấy danh sách notification thành công",
            notifications: notifications
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Lỗi khi lấy danh sách notification",
        });
    }
}

exports.read_all_notification = async (req, res) => {
    const userId = req.userId;
    try {
        await notification.update({ is_read: true }, { where: { to_user_id: userId } });
        return res.status(200).send({
            message: "Đã đọc tất cả notification",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Lỗi khi đọc tất cả notification",
        });
    }
}

