const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const Semeter = require("../models/Semeter");
const CapstoneCouncil = sequelize.define(
  "CapstoneCouncil",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: true },
    status: { type: DataTypes.BOOLEAN, allowNull: false },
    semeter_id: {
      field: "semeter_id",
      type: DataTypes.INTEGER,
      references: {
        model: Semeter,
        key: "id"
      }
    }
  },
  { tableName: "capstone_councils" }
);

module.exports = CapstoneCouncil;
