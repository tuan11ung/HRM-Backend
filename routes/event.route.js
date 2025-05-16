const controller = require("../controllers/event.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.post("/api/event", [authJwt.verifyToken], controller.create_event);
    app.get("/api/event", [authJwt.verifyToken], controller.get_all_event);
    app.get("/api/event/:id", [authJwt.verifyToken], controller.get_event_by_id);
    app.put("/api/event/:id", [authJwt.verifyToken], controller.update_event);
    app.delete("/api/event/:id", [authJwt.verifyToken], controller.delete_event);
    app.get("/api/event-nearest", [authJwt.verifyToken], controller.get_nearest_event);

    // For admin
    app.get("/api/event-admin", [authJwt.verifyToken], controller.get_all_event_for_admin);
    
};