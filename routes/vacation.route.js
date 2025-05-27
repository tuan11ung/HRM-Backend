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
    app.put("/api/vacation/:id", [authJwt.verifyToken], controller.update_pending_vacation);
    app.delete("/api/vacation/:id", [authJwt.verifyToken], controller.delete_vacation);
    app.get("/api/vacation/:id", [authJwt.verifyToken], controller.get_vacation_by_id);
    app.put("/api/vacation/admin/approve/:id", [authJwt.verifyToken], controller.approve_vacation);
    app.put("/api/vacation/admin/reject/:id", [authJwt.verifyToken], controller.decline_vacation);
    app.get("/api/vacation/admin/get-all", [authJwt.verifyToken], controller.get_all_vacation_by_admin);
};