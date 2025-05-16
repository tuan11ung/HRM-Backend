const db = require("../models");
const config = require("../config/auth.config");
const user = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// Đăng kí tài khoản
exports.signup = (req, res) => {
  // Save user to Database
  user.create({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      res.send({ message: "user registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
// Đăng nhập tài khoản
exports.signin = (req, res) => {
  user.findOne({
    where: {
      email: req.body.email || ""
    }
  })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          accessToken: null,
          message: "Tài khoản không tồn tại, vui lòng tạo mới tài khoản"
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Sai mật khẩu, vui lòng thử lại"
        });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400 * 30, // 24 hours
        });

      res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};