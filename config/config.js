module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
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
// sync model
Role.sync();
Campus.sync();
User.sync();
CapstoneCouncil.sync();
CapstoneTeam.sync();
UserRole.sync();
Campus.hasMany(User);
CapstoneTeam.hasMany(UserRole);
CapstoneCouncil.hasMany(UserRole);
Role.hasMany(UserRole);
