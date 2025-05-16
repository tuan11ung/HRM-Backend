const controller = require("../controllers/upload.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  // Route for uploading an image to Cloudflare R2
  app.post("/api/upload/image", controller.uploadImage);
}; 