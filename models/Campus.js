"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Campus = sequelize.define(
  "Campus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "campuses",
  }
);

module.exports = Campus;
