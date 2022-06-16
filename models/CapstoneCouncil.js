const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const CapstoneCouncil = sequelize.define(
  "CapstoneCouncil",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncremental: true },
  },
  { tableName: "capstone_councils" }
);

module.exports = CapstoneCouncil;
