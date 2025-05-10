module.exports = (sequelize, Sequelize) => {
    const Position = sequelize.define(
      "position",
      {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          position_name: {
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
        tableName: "position",
      }
    );
    return Position;
  };