"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    tableName: "rooms"
  }
);

module.exports = Room;
