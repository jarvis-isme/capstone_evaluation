"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Room = require("./Room");
const CapstoneCouncil = require("./CapstoneCouncil");
const Report = require("./Report");

const CouncilLocation = sequelize.define(
  "CouncilLocation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      field: "room_id",
      type: DataTypes.INTEGER,
      references: {
        model: Room,
        key: "id"
      }
    },
    council_id: {
      field: "council_id",
      type: DataTypes.INTEGER,
      references: {
        model: CapstoneCouncil,
        key: "id"
      }
    },
    report_id: {
      feild: "report_id",
      type: DataTypes.INTEGER,
      references: {
        model: Report,
        key: "id"
      }
    }
  },
  {
    tableName: "council_locations"
  }
);

module.exports = CouncilLocation;
