"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Relawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Relawan.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Relawan.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      skill: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Relawan",
    }
  );
  return Relawan;
};
