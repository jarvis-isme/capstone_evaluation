const Report = require("../../models/Report");
const User = require("../../models/User");
const File = require("../../models/File");
const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");
const CapstoneTeam = require("../../models/CapstoneTeam");
const Topic = require("../../models/Topic");

// insert or update report
const upsertReport = async (reportItem, trans) => {
  const [report, created] = await Report.upsert(reportItem, {
    transaction: trans,
  });
  return [report, created];
};

// get report by capstone team code
const getReportByCode = async (capstoneTeam) => {
  const reports = await Report.findAll({
    where: {
      capstone_team_id: capstoneTeam.id,
    },
  });
  return reports ? reports : [];
};

//submit file for report
const submitFile = async (code, type, path, name, user) => {
  let response = {};
  const report = await Report.findOne({
    where: {
      code: code,
    },
  });
  const file = await File.findOne({
    where: {
      type: type,
      report_id: report.id,
      status: true,
    },
  });
  if (file) {
    file.update(
      {
        status: false,
      },
      {
        where: {
          id: report.id,
        },
      }
    );
  }
  const newFile = await File.create({
    name: name,
    path: path,
    type: type,
    reportId: report.id,
    userId: user.id,
  });
  report.update({
    submit_date: Date(),
  });
  return response;
};

// get detail report
const getDetailReport = async (report, user) => {
  let response = {};
  const capstoneTeam = await CapstoneTeam.findOne({
    where: {
      id: report.capstone_team_id,
    },
  });
  const topic = await Topic.findOne({
    where: {
      id: capstoneTeam.topic_id,
    },
  });
  const rawQuery = `select F.id as file_id,
   F.name as name, 
   F.path as path, 
   U.name as upload_by, 
   U.id,
   F.type as type
  from files F join users U on F.user_id = U.id 
  where F.status =true and F.report_id =${report.id}`;
  const submition = await sequelize.query(rawQuery, {
    type: QueryTypes.SELECT,
  });

  response = {
    topic: topic,
    report: report,
    submition: submition,
  };
  return response;
};

module.exports = {
  upsertReport,
  getReportByCode,
  getDetailReport,
  submitFile,
};
