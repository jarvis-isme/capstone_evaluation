"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Campus = require("./Campus");

const User = sequelize.define(
  "User",
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
    gender: {
      type: DataTypes.BOOLEAN,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    birthday: {
      type: DataTypes.DATE,
    },
    avatar: {
      type: DataTypes.STRING(200),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    campus_id: {
      field: "campus_id",
      type: DataTypes.INTEGER,
      references: {
        model: Campus,
        key: "id",
      },
    },
  },
  {
    tableName: "users",
  }
);

module.exports = User;
