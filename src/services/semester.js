const Semeter = require("../../models/Semeter");
const { Op } = require("sequelize");

const getAllSemester = async () => {
  console.log("e");
  let respone = [];
  const now = Date.now();
  const semesters = await Semeter.findAll({
    where: {
      start_at: {
        [Op.lte]: now,
      },
      end_at: {
        [Op.gte]: now,
      },
    },
  });
  respone = semesters;
  return respone;
};

module.exports = { getAllSemester };
