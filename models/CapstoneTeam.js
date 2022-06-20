const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const Semeter = require("./Semeter");
const Topic = require("./Topic");
const CapstoneTeam = sequelize.define(
  "CapstoneTeam",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: true },
    status: { type: DataTypes.STRING(1), allowNull: false },
    semeter_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Semeter,
        key: "id"
      }
    },
    topic_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Topic,
        key: "id"
      }
    }
  },
  { tableName: "capstone_teams" }
);

module.exports = CapstoneTeam;
