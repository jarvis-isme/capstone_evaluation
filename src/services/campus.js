const Campus = require("../../models/Campus");
const sequelize = require("../../db");

//get all campus
const getAllCampus = async () => {
  const campuses = await Campus.findAll();
  return campuses ? campuses : [];
};

module.exports = {
  getAllCampus,
};
