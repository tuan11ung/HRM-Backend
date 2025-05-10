module.exports = (sequelize, Sequelize) => {
    const Vacation = sequelize.define(
      "vacation",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        request_type: {
          type: Sequelize.ENUM('Vacation', 'Sick Leave', 'Work Remotely'),
          allowNull: false,
        },
        start_day: {
          type: Sequelize.DATEONLY, // Chỉ lưu ngày, không lưu giờ
          allowNull: false,
        },
        end_day: {
          type: Sequelize.DATEONLY, // Chỉ lưu ngày, không lưu giờ
          allowNull: false,
        },
        start_hour: {
          type: Sequelize.TIME, // Chỉ lưu giờ
          allowNull: true,
        },
        end_hour: {
          type: Sequelize.TIME, // Chỉ lưu giờ
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('Pending', 'Approve', 'Reject'),
          defaultValue: 'Pending',
          allowNull: false,
        },
        comment: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        tableName: "vacation",
      }
    );
    return Vacation;
  };