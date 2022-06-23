const Report = require("../../models/Report");

// insert or update report
const upsertReport = async (reportItem, trans) => {
  const [report, created] = await Report.upsert(reportItem, {
    transaction: trans,
  });
  return [report, created];
};

const getReportByCode = async (capstoneTeam) => {
  const reports = await Report.findAll({
    where: {
      capstone_team_id: capstoneTeam.id,
    },
  });
  return reports ? reports : [];
};
module.exports = {
  upsertReport,
  getReportByCode,
};
