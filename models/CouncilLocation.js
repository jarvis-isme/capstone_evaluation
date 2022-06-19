"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Room = require("./Room");
const CapstoneCouncil = require("./CapstoneCouncil");

const CouncilLocation = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Room,
        key: "id"
      }
    },
    council_id: {
      type: DataTypes.INTEGER,
      references: {
        model: CapstoneCouncil,
        key: "id"
      }
    }
  },
  {
    tableName: "council_locations"
  }
);

module.exports = CouncilLocation;
