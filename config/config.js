require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
};

const Campus = require("../models/Campus");
const User = require("../models/User");
const Role = require("../models/Role");
const CapstoneTeam = require("../models/CapstoneTeam");
const CapstoneCouncil = require("../models/CapstoneCouncil");
const UserRole = require("../models/UserRole");
const Room = require("../models/Room");
const CouncilLocation = require("../models/CouncilLocation");
const Semeter = require("../models/Semeter");
const Topic = require("../models/Topic");
const Report = require("../models/Report");
const File = require("../models/File");
const Setting = require("../models/Setting");
const Grade = require("../models/Grade");
// sync model
// Campus.hasMany(User);
// CapstoneTeam.hasMany(UserRole);
// UserRole.belongsTo(CapstoneTeam);
// CapstoneCouncil.hasMany(UserRole);
// UserRole.belongsTo(CapstoneCouncil);
// Role.hasMany(UserRole);
// UserRole.belongsTo(Role);

Role.sync({ alter: true });
Campus.sync({ alter: true });
User.sync({ alter: true });
Room.sync({ alter: true });
Semeter.sync({ alter: true });
Topic.sync({ alter: true });
CapstoneCouncil.sync({ alter: true });
CapstoneTeam.sync({ alter: true });
UserRole.sync({ alter: true });
Report.sync({ alter: true });
CouncilLocation.sync({ alter: true });
File.sync({ alter: true });
Setting.sync({ alter: true });
Grade.sync({ alert: true });
// Campus.hasMany(User);
// CapstoneTeam.hasMany(UserRole);
// UserRole.belongsTo(CapstoneTeam);
// CapstoneCouncil.hasMany(UserRole);
// UserRole.belongsTo(CapstoneCouncil);
// Role.hasMany(UserRole);
// UserRole.belongsTo(Role);
// Semeter.hasMany(CapstoneTeam);
// Topic.belongsTo(CapstoneTeam);
