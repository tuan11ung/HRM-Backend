const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(403).send({
      message: "Không tìm thấy token"
    });
  }
  const token = authorizationHeader.split(' ')[1];
  
  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Token không hợp lệ",
                });
              }
              req.userId = decoded.id;
              next();
            });
};

const authJwt = {
  verifyToken: verifyToken
};
module.exports = authJwt;
