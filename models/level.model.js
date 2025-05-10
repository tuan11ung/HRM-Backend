module.exports = (sequelize, Sequelize) => {
    const Level = sequelize.define(
      "level",
      {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          level_name: {
            type: Sequelize.STRING,
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
        tableName: "level",
      }
    );
    return Level;
  };