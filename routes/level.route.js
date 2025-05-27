const controller = require("../controllers/level.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.post("/api/level", [authJwt.verifyToken], controller.create_level);
    app.get("/api/level", [authJwt.verifyToken], controller.get_all_level);
    app.delete("/api/level/:id", [authJwt.verifyToken], controller.delete_level);
    app.put("/api/level/:id", [authJwt.verifyToken], controller.update_level);
};