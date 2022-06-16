const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Role = sequelize.define(
  "Role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncremental: true },
    name: { type: DataTypes.STRING(20), allowNull: false },
    code: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  },
  { tableName: "roles" }
);

module.exports = Role;
