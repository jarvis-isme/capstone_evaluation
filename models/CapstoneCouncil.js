const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const CapstoneCouncil = sequelize.define(
  "CapstoneCouncil",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncremental: true },
    code: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: true },
    status: { type: DataTypes.BOOLEAN, allowNull: false }
  },
  { tableName: "capstone_councils" }
);

module.exports = CapstoneCouncil;
