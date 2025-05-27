module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define(
      "notification",
      {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          from_user_id: {
            type: Sequelize.INTEGER,
          },
          to_user_id: {
            type: Sequelize.INTEGER,
          },
          title: {
            type: Sequelize.STRING,
          },
          content: {
            type: Sequelize.STRING,
          },
          is_read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
        tableName: "notification",
      }
    );
    return Notification;
  };