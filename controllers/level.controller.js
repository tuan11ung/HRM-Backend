const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const Level = db.level;

exports.create_level = async (req, res) => {

    try {
        const levelName = req.body.level_name;
        if (!levelName) {
            return res.status(500).send({
                message: "Vui lòng nhập thông tin"
            })
        }
        Level.create({
            level_name: req.body.level_name,
        })
            .then(user => {
                return res.status(200).send({
                    message: "Tạo Level thành công"
                });
            })
            .catch(err => {
                return res.status(500).send({
                    message: err.message
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }

}

exports.get_all_level = async (req, res) => {
    try {
        const levels = await Level.findAll();
        return res.status(200).send({
            message: "Lấy danh sách Level thành công",
            data: levels
        });
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.update_level = async (req, res) => {
    try {
        const levelId = req.params.id;
        const levelName = req.body.level_name;
        await Level.update({ level_name: levelName }, { where: { id: levelId } });
        return res.status(200).send({
            message: "Cập nhật Level thành công"
        });
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.delete_level = async (req, res) => {
    try {
        const levelId = req.params.id;
        await Level.destroy({ where: { id: levelId } });
        return res.status(200).send({
            message: "Xóa Level thành công"
        });
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}