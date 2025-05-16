module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      "user",
      {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          position_id: {
            type: Sequelize.INTEGER,
          },
          level_id: {
            type: Sequelize.INTEGER,
          },
          email: {
            type: Sequelize.STRING,
            unique: true
          },
          mobile_phone: {
            type: Sequelize.STRING,
            unique: true
          },
          name: {
            type: Sequelize.STRING,
          },
          address: {
            type: Sequelize.STRING,
          },
          image: {
            type: Sequelize.STRING,
          },
          avatar: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          birthday: {
            type: Sequelize.DATE,
          },
          password: {
            type: Sequelize.STRING,
          },
          role: {
            type: Sequelize.ENUM('Admin', 'Employee'),
            allowNull: false,
            defaultValue: 'Employee'
          },
          created_at: {
            type: Sequelize.DATE,
          },
          updated_at: {
            type: Sequelize.DATE,
          },
        },
      {
        timestamps: true,
        tableName: "user",
      }
    );
    return User;
  };