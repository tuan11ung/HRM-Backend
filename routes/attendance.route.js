const controller = require("../controllers/attendance.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.post("/api/attendance/checkin", [authJwt.verifyToken] , controller.check_in);
    app.post("/api/attendance/checkout", [authJwt.verifyToken], controller.check_out);
    app.get("/api/attendance/get_attendance", [authJwt.verifyToken], controller.get_all_attendance);
    app.get("/api/attendance/get_today_attendance_status", [authJwt.verifyToken], controller.get_today_attendance_status);
    app.get("/api/attendance/:id", [authJwt.verifyToken], controller.get_attendance_by_id);
};