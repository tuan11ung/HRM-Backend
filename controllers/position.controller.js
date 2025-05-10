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
             
    } catch (err) {
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}