const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const User = require("./User");
const CapstoneTeam = require("./CapstoneTeam");
const CapstoneCouncil = require("./CapstoneCouncil");
const Role = require("./Role");
const UserRole = sequelize.define(
  "UserRole",
  {
    userId: {
      field: "user_id",
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    capstoneTeamId: {
      field: "capstone_team_id",
      type: DataTypes.INTEGER,
      references: {
        model: CapstoneTeam,
        key: "id",
      },
    },
    councilTeamId: {
      field: "capstone_council_id",
      type: DataTypes.INTEGER,
      references: {
        model: CapstoneCouncil,
        key: "id",
      },
    },
    roleId: {
      field: "role_id",
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: [
          "user_id",
          "role_id",
          "capstone_team_id",
          "capstone_council_id",
        ],
      },
    ],
    tableName: "user_roles",
  }
);

module.exports = UserRole;
