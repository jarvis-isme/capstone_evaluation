const Setting = require("../../models/Setting");
const Grade = require("../../models/Grade");
const User = require("../../models/User");
const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");
const UserRole = require("../../models/UserRole");

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

const submitGrade = async (report, details, user) => {
  let response = {
    code: 200,
    message: "Submit Grade Successfully",
    data: null,
  };
  details.forEach(async (detail) => {
    const grade = await Grade.findOne({
      where: {
        reportId: report.id,
        user_id: detail.id,
      },
    });
    let totalGrade = 0;

    let gradeDetails = grade.gradeDetail.grades;
    gradeDetails?.forEach((gradeDetail) => {
      if (gradeDetail.grade_by == user.id) {
        gradeDetail.marks = detail.marks;
        console.log(gradeDetail.marks[0]);
      }
      gradeDetail.marks.forEach((grade) => {
        console.log(grade);
        totalGrade += grade.value * grade.mark;
      });
    });
    console.log(totalGrade / 5);
    await Grade.update(
      {
        totalGrade: totalGrade / 5,
        gradeDetail: {
          grades: gradeDetails,
        },
      },
      {
        where: {
          id: grade.id,
        },
      }
    );
  });

  return response;
};
module.exports = {
  getFormSubmitGrade,
  submitGrade,
};
