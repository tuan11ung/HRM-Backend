const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const Position = db.position;

exports.create_position = async (req, res) => {
    const positionName = req.body.position_name;
    try {
        if (!positionName) {
            return res.status(500).send({
                message: "Vui lòng nhập thông tin"
            })
        }
        Position.create({
            position_name: req.body.position_name,
        })
            .then(user => {
                return res.status(200).send({
                    message: "Tạo Position thành công"
                });
            })
            .catch(err => {
                res.status(500).send({ 
                    message: err.message 
                });
            });

    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.get_all_position = async (req, res) => {
    try {
        const positions = await Position.findAll();
        return res.status(200).send({
            message: "Lấy danh sách Position thành công",
            data: positions
        });
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.update_position = async (req, res) => {
    try {
        const positionId = req.params.id;
        const positionName = req.body.position_name;
        await Position.update({ position_name: positionName }, { where: { id: positionId } });
        return res.status(200).send({
            message: "Cập nhật Position thành công"
        });
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.delete_position = async (req, res) => {
    try {
        const positionId = req.params.id;
        await Position.destroy({ where: { id: positionId } });
        return res.status(200).send({
            message: "Xóa Position thành công"
        });
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}