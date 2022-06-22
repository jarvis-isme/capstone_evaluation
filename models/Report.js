"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const CapstoneTeam = require("./CapstoneTeam");

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
      feild: "start_at"
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
      feild: "end_at"
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    submit_date: {
      type: DataTypes.DATE,
      allowNull: true,
      feild: "submit_date"
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    date_grade: {
      type: DataTypes.DATE,
      allowNull: true,
      feild: "date_grade"
    },
    capstone_team_id: {
      field: "capstone_team_id",
      type: DataTypes.INTEGER,
      references: {
        model: CapstoneTeam,
        key: "id"
      }
    }
  },
  {
    tableName: "reports"
  }
);

module.exports = Report;
