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
  
  // Route for uploading an image file to Cloudflare Images
  app.post("/api/upload/image", [authJwt.verifyToken], controller.uploadImage);
  
  // Route for uploading an image from URL to Cloudflare Images
  app.post("/api/upload/image-url", [authJwt.verifyToken], controller.uploadImageUrl);
}; 