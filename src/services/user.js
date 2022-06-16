const sequelize = require("../../db");
const Campus = require("../../models/Campus");
const User = require("../../models/User");

//login
const login = async (idCampus, idToken) => {
  const campus = await Campus.findAll();
  return {};
};

module.exports = {
  login,
};
