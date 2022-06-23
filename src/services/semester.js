const Semeter = require("../../models/Semeter");
const { Op } = require("sequelize");

const getAllSemester = async () => {
  let respone = [];
  const semesters = await Semeter.findAll({
    order: [["id", "DESC"]],
  });
  respone = semesters;
  return respone;
};

module.exports = { getAllSemester };
