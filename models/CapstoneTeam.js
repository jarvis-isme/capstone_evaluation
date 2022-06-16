const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const CapstoneTeam = sequelize.define(
  "CapstoneTeam",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  { tableName: "capstone_teams" }
);

module.exports = CapstoneTeam;
