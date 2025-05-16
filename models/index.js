const Sequelize = require("sequelize");
require('dotenv').config();

// Connect to database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      ca: process.env.DB_SSL_CERT,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: false,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Khai bao cac model
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.position = require("../models/position.model.js")(sequelize, Sequelize);
db.level = require("../models/level.model.js")(sequelize, Sequelize);
db.vacation = require("../models/vacation.model.js")(sequelize, Sequelize);
db.event = require("../models/event.model.js")(sequelize, Sequelize);
db.attendance = require("../models/attendance.model.js")(sequelize, Sequelize);

module.exports = db;