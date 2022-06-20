const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Topic = sequelize.define(
  "Topic",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(500), allowNull: false },
    code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(500), allowNull: false }
  },
  { tableName: "topics" }
);

module.exports = Topic;
