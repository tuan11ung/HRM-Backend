module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define(
      "event",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        category: {
          type: Sequelize.ENUM('Corporate Event', 'Meetup', 'Holiday', 'Invidiual'),
          allowNull: false,
        },
        priority: {
          type: Sequelize.ENUM('Low','Medium','High'), // Chỉ lưu ngày, không lưu giờ
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY, // Chỉ lưu giờ
          allowNull: true,
        },
        time: {
          type: Sequelize.TIME, // Chỉ lưu giờ
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        repeat_event_type: {
          type: Sequelize.ENUM('Daily', 'Weekly', 'Monthly', 'Yearly','None'),
          allowNull: true,
        },
        repeat_event_day: {
          type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
          allowNull: true,
        },
        repeat_event_time: {
          type: Sequelize.TIME,
          allowNull: true,
        },

      },
      {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        tableName: "event",
      }
    );
    return Event;
  };