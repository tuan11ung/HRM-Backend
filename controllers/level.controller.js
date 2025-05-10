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