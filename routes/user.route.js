const controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get("/api/user", controller.get_all_user);
    app.get("/api/user/:id",  [authJwt.verifyToken] , controller.get_user_by_id);
    app.post("/api/user", controller.create_new_user);
    app.post("/api/user/update", [authJwt.verifyToken], controller.update_user);
    app.get("/api/user-active",[authJwt.verifyToken], controller.get_active_users);
  };