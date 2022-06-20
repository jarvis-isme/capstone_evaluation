const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Semeter = sequelize.define(
  "Semeter",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncremental: true },
    name: { type: DataTypes.STRING(20), allowNull: false },
    code: { type: DataTypes.STRING(20), allowNull: false },
    start_at: { type: DataTypes.DATE, allowNull: false },
    end_at: { type: DataTypes.DATE, allowNull: false }
  },
  { tableName: "semeters" }
);

module.exports = Semeter;
