const Setting = require("../../models/Setting");
const Grade = require("../../models/Grade");
const User = require("../../models/User");
const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");

const getFormSubmitGrade = async (report, user) => {
  let respone = {};
  let rows = [];

  const markColumns = await Setting.findAll({
    where: {
      code: "M001",
    },
  });

  const rawQuery = `select U.id, U.name , U.code, G.grade_detail from users U join grades G on U.id = G.user_id
   where G.report_id =${report.id}`;
  grades = await sequelize.query(rawQuery, {
    type: QueryTypes.SELECT,
  });
  grades.forEach((grade) => {
    const details = grade.grade_detail.grades;
    details.forEach((detail) => {
      if (detail.grade_by === user.id) {
        rows.push({
          id: grade.id,
          name: grade.name,
          code: grade.code,
          marks: detail.marks,
        });
      }
    });
  });
  respone = {
    mark_columns: markColumns,
    rows: rows,
  };
  return respone;
};

module.exports = {
  getFormSubmitGrade,
};
