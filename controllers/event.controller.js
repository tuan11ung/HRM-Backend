const e = require("express");
const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const Event = db.event;

exports.create_event = async (req, res) => {
    try {
        const name = req.body.name;
        const category = req.body.category;
        const priority = req.body.priority;
        const date = req.body.date;
        const time = req.body.time;
        const description = req.body.description;
        const repeat_event_type = req.body.repeat_event_type;
        const repeat_event_day = req.body.repeat_event_day;
        const repeat_event_time = req.body.repeat_event_time;

        if (!name || !category || !priority || !description) {
            return res.status(500).send({
                message: "Vui lòng nhập thông tin"
            })
        }
        Event.create({
            name: name,
            category: category,
            priority: priority,
            date: date,
            time: time,
            description: description,
            repeat_event_type: repeat_event_type,
            repeat_event_day: repeat_event_day || null,
            repeat_event_time: repeat_event_time || null
        })
            .then(user => {
                return res.status(200).send({
                    message: "Tạo sự kiện thành công"
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

exports.get_all_event = async (req, res) => {
    try {
        const month = parseInt(req.query.month); // Tháng từ 1 đến 12
        const year = parseInt(req.query.year);
        
        // Xác định ngày đầu tiên và ngày cuối cùng của tháng trong UTC
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0)); // Ngày cuối cùng của tháng
        
        // Lấy tất cả sự kiện từ database
        const events = await Event.findAll();
        
        // Tạo object để lưu trữ sự kiện theo ngày
        const eventsByDate = {};
        
        // Hàm để thêm sự kiện vào ngày cụ thể
        const addEventToDate = (date, event) => {
            const dateKey = date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        };
        
        // Ánh xạ tên ngày sang số (0: Sunday, 1: Monday, ..., 6: Saturday)
        const dayMapping = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        };
        
        // Xử lý từng sự kiện
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const repeatType = event.repeat_event_type;
            
            if (repeatType === 'None') {
                // Sự kiện không lặp, chỉ thêm nếu nằm trong tháng
                if (eventDate >= startDate && eventDate <= endDate) {
                    addEventToDate(eventDate, event);
                }
            } else if (repeatType === 'Daily') {
                // Sự kiện lặp hàng ngày
                for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
                    addEventToDate(new Date(d), event);
                }
            } else if (repeatType === 'Weekly') {
                // Xử lý repeat_event_day
                let repeatDays = event.repeat_event_day;
                if (typeof repeatDays === 'string') {
                    repeatDays = [dayMapping[repeatDays]];
                } else if (Array.isArray(repeatDays)) {
                    repeatDays = repeatDays.map(day => dayMapping[day] !== undefined ? dayMapping[day] : day);
                } else {
                    repeatDays = []; // Mặc định rỗng nếu không hợp lệ
                }
                for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
                    if (repeatDays.includes(d.getUTCDay())) {
                        addEventToDate(new Date(d), event);
                    }
                }
            } else if (repeatType === 'Monthly') {
                // Sự kiện lặp hàng tháng
                const eventDay = eventDate.getUTCDate(); // Lấy ngày trong UTC
                const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
                if (eventDay <= lastDayOfMonth) {
                    const monthlyDate = new Date(Date.UTC(year, month - 1, eventDay));
                    if (monthlyDate >= startDate && monthlyDate <= endDate) {
                        addEventToDate(monthlyDate, event);
                    }
                }
            } else if (repeatType === 'Yearly') {
                // Sự kiện lặp hàng năm
                const eventMonth = eventDate.getUTCMonth() + 1;
                const eventDay = eventDate.getUTCDate();
                if (eventMonth === month) {
                    const yearlyDate = new Date(Date.UTC(year, month - 1, eventDay));
                    if (yearlyDate >= startDate && yearlyDate <= endDate) {
                        addEventToDate(yearlyDate, event);
                    }
                }
            }
        });
        
        // Chuyển đổi thành mảng và sắp xếp theo ngày
        const result = Object.entries(eventsByDate).map(([date, events]) => ({
            date,
            events
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Trả về kết quả
        return res.status(200).send({
            data: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
};

exports.get_event_by_id = async (req, res) => {
    try {
        const event_id = req.params.id;
        const event = await Event.findOne({
            where: {
                id: event_id
            }
        });
        if (!event) {
            return res.status(500).send({
                message: "Không tìm thấy sự kiện"
            })
        }
        return res.status(200).send({
            data: event
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.update_event = async (req, res) => { 
    try {
        const event_id = req.params.id;
        const name = req.body.name;
        const category = req.body.category;
        const priority = req.body.priority;
        const date = req.body.date;
        const time = req.body.time;
        const description = req.body.description;
        const repeat_event_type = req.body.repeat_event_type;
        const repeat_event_day = req.body.repeat_event_day;
        const repeat_event_time = req.body.repeat_event_time;

        if (!name || !category || !priority || !description) {
            return res.status(500).send({
                message: "Vui lòng nhập thông tin"
            })
        }
        Event.update({
            name: name,
            category: category,
            priority: priority,
            date: date,
            time: time,
            description: description,
            repeat_event_type: repeat_event_type,
            repeat_event_day: repeat_event_day,
            repeat_event_time: repeat_event_time
        }, {
            where: {
                id: event_id
            }
        })
            .then(user => {
                return res.status(200).send({
                    message: "Cập nhật sự kiện thành công"
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

exports.delete_event = async (req, res) => {
    try {
        const event_id = req.params.id;
        const event = await Event.findOne({
            where: {
                id: event_id
            }
        });
        if (!event) {
            return res.status(500).send({
                message: "Không tìm thấy sự kiện"
            })
        }
        Event.destroy({
            where: {
                id: event_id
            }
        })
            .then(user => {
                return res.status(200).send({
                    message: "Xóa sự kiện thành công"
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

exports.get_nearest_event = async (req, res) => {
    try {
        const now = new Date();
        const currentDateString = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const currentTime = now.toTimeString().split(' ')[0]; // 'HH:MM:SS'

        const events = await Event.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {
                        date: { [Sequelize.Op.gt]: currentDateString }
                    },
                    {
                        date: currentDateString,
                        time: { [Sequelize.Op.gte]: currentTime }
                    }
                ]
            },
            order: [
                ['date', 'ASC'],
                ['time', 'ASC']
            ],
            limit: 3
        });

        if (events.length === 0) {
            return res.status(200).send({
                message: "Không có sự kiện nào sắp tới"
            });
        }

        return res.status(200).send({
            data: events
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

// For admin
exports.get_all_event_for_admin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const searchName = req.query.name || '';

        const whereCondition = {};
        if (searchName) {
            whereCondition.name = {
                [Sequelize.Op.like]: `%${searchName}%`
            };
        }

        const { count, rows: events } = await Event.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).send({
            data: events,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}