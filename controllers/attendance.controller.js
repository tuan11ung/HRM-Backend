const db = require("../models");
const { Sequelize, DataTypes } = require('sequelize');
const Attendance = db.attendance;


exports.get_today_attendance_status = async (req, res) => {
    try {
        const employeeId = req.userId;
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Ngày dạng 'YYYY-MM-DD'

        const attendance = await Attendance.findOne({
            where: {
                employee_id: employeeId,
                date: date
            }
        });
        return res.status(200).send({
            message: "Trạng thái check-in hôm nay",
            attendance: attendance
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.check_in = async (req, res) => {
    try {
        // Lấy employeeId từ body của request
        const employeeId = req.userId;

        // Lấy thời gian hiện tại
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Ngày dạng 'YYYY-MM-DD'
        const timeIn = currentDate.toTimeString().split(' ')[0]; // Giờ dạng 'HH:MM:SS'

        // Kiểm tra xem nhân viên đã check-in chưa
        const existingAttendance = await Attendance.findOne({
            where: {
                employee_id: employeeId,
                date: date
            }
        });

        if (existingAttendance) {
            return res.status(400).send({
                message: "Nhân viên đã check-in rồi"
            });
        }

        if (timeIn > "08:00:00") {
            // Nếu check-in sau 8h thì đánh dấu là muộn
            await Attendance.create({
                employee_id: employeeId,
                date: date,
                time_in: timeIn,
                status: 'Late'
            });
            return res.status(200).send({
                message: "Check-in thành công, nhưng bạn đã đến muộn"
            });
        }

        // Tạo bản ghi mới
        await Attendance.create({
            employee_id: employeeId,
            date: date,
            time_in: timeIn,
            status: 'Present'
        });

        return res.status(200).send({
            message: "Check-in thành công"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
};

exports.check_out = async (req, res) => {
    try {
        // Lấy employeeId từ body của request
        const employeeId = req.userId;

        // Lấy thời gian hiện tại
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Ngày dạng 'YYYY-MM-DD'
        const timeOut = currentDate.toTimeString().split(' ')[0]; // Giờ dạng 'HH:MM:SS'

        // Kiểm tra xem nhân viên đã check-in chưa
        const existingAttendance = await Attendance.findOne({
            where: {
                employee_id: employeeId,
                date: date
            }
        });

        if (!existingAttendance) {
            return res.status(400).send({
                message: "Nhân viên chưa check-in"
            });
        }

        // Cập nhật thời gian check-out
        existingAttendance.time_out = timeOut;
        await existingAttendance.save();

        return res.status(200).send({
            message: "Check-out thành công"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}

exports.get_all_attendance = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const employeeId = req.userId;
        const month = parseInt(req.query.month); // Tháng từ 1 đến 12
        const year = parseInt(req.query.year);

        // Kiểm tra đầu vào
        if (!month || !year) {
            return res.status(400).send({
                message: "Vui lòng cung cấp tháng và năm"
            });
        }

        // Tính toán ngày bắt đầu và kết thúc của tháng
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0)); // Ngày cuối cùng của tháng

        // Truy vấn cơ sở dữ liệu để lấy thông tin điểm danh
        const attendanceRecords = await Attendance.findAll({
            where: {
                employee_id: employeeId,
                date: {
                    [Sequelize.Op.gte]: startDate, // Lớn hơn hoặc bằng ngày bắt đầu
                    [Sequelize.Op.lte]: endDate    // Nhỏ hơn hoặc bằng ngày kết thúc
                }
            },
            order: [['date', 'ASC']] // Sắp xếp theo ngày tăng dần
        });

        // Trả về kết quả cho client
        return res.status(200).send(attendanceRecords);
    } catch (err) {
        // Xử lý lỗi nếu có
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
};

exports.get_attendance_by_id = async (req, res) => {
    try {
        const attendanceId = req.params.id;
        const attendance = await Attendance.findByPk(attendanceId);
        return res.status(200).send({
            message: "Lấy thông tin điểm danh thành công",
            attendance: attendance
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Có lỗi xảy ra, vui lòng thử lại"
        });
    }
}