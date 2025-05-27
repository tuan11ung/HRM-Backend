const controller = require("../controllers/position.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.post("/api/position", [authJwt.verifyToken], controller.create_position);
    app.get("/api/position", [authJwt.verifyToken], controller.get_all_position);
    app.delete("/api/position/:id", [authJwt.verifyToken], controller.delete_position);
    app.put("/api/position/:id", [authJwt.verifyToken], controller.update_position);
};