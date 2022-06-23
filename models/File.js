const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Report = require("./Report");

const File = sequelize.define(
  "File",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    path: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    type: { type: DataTypes.BOOLEAN, defaultValue: true },
    reportId: {
      field: "report_id",
      type: DataTypes.INTEGER,
      references: {
        model: Report,
        key: "id",
      },
    },
    userId: {
      field: "user_id",
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "files",
  }
);

module.exports = File;
