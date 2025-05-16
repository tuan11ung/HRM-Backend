module.exports = (sequelize, Sequelize) => {
    const Attendance = sequelize.define(
      "attendance",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY, // Chỉ lưu giờ
          allowNull: true,
        },
        time_in: {
          type: Sequelize.TIME, // Chỉ lưu giờ
          allowNull: true,
        },
        time_out: {
          type: Sequelize.TIME, // Chỉ lưu giờ
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('Present', 'Absent', 'Leave','Late'),
          allowNull: false,
        },
      },
      {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        tableName: "attendance",
      }
    );
    return Attendance;
  };