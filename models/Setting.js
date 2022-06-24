const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { tableName: "settings" }
);

module.exports = Setting;
