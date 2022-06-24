const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const Report = require("./Report");
const User = require("./User");

const Grade = sequelize.define(
  "Grade",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    gradeDetail: {
      field: "grade_detail",
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "grades",
  }
);

module.exports = Grade;
