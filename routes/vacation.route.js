const controller = require("../controllers/vacation.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.post("/api/vacation", [authJwt.verifyToken], controller.create_vacation);
    app.get("/api/vacation", [authJwt.verifyToken], controller.get_all_vacation);
    app.get("/api/vacation/:id", [authJwt.verifyToken], controller.get_vacation_by_id);
    app.post("/api/vacation/approve/:id", [authJwt.verifyToken], controller.approve_vacation);
    app.post("/api/vacation/reject/:id", [authJwt.verifyToken], controller.decline_vacation);
};