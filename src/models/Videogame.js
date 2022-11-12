const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "videogame",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      rating: {
        type: DataTypes.FLOAT(5),
        defaultValue: null,
      },
      platforms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      createdInDb: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
};
