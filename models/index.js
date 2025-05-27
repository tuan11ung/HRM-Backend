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
db.notification = require("../models/notification.model.js")(sequelize, Sequelize);

// Thiết lập quan hệ giữa user và attendance
db.user.hasMany(db.attendance, {
  foreignKey: 'employee_id',
  as: 'attendances'
});
db.attendance.belongsTo(db.user, {
  foreignKey: 'employee_id',
  as: 'user'
});

// Fix relationships between user, level and position
db.level.hasMany(db.user, {
  foreignKey: 'level_id',
  as: 'users'
});
db.user.belongsTo(db.level, {
  foreignKey: 'level_id',
  as: 'level'
});

db.position.hasMany(db.user, {
  foreignKey: 'position_id',
  as: 'users'
});
db.user.belongsTo(db.position, {
  foreignKey: 'position_id',
  as: 'position'
});

// Thiết lập quan hệ giữa user và notification
db.user.hasMany(db.notification, {
  foreignKey: 'from_user_id',
  as: 'sent_notifications'
});
db.notification.belongsTo(db.user, {
  foreignKey: 'from_user_id',
  as: 'sender'
});

// Thiết lập quan hệ giữa user và notification (receiver)
db.user.hasMany(db.notification, {
  foreignKey: 'to_user_id',
  as: 'received_notifications'
});
db.notification.belongsTo(db.user, {
  foreignKey: 'to_user_id',
  as: 'receiver'
});

// Thiết lập quan hệ giữa user và vacation
db.user.hasMany(db.vacation, {
  foreignKey: 'user_id',
  as: 'vacations'
});
db.vacation.belongsTo(db.user, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = db;