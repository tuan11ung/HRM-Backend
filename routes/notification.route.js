const controller = require("../controllers/notification.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get("/api/notification", [authJwt.verifyToken], controller.get_all_notification);
    app.put("/api/notification/read-all", [authJwt.verifyToken], controller.read_all_notification);
  };