const Report = require("../../models/Report");

// insert or update report
const upsertReport = async (reportItem, trans) => {
  const [report, created] = await Report.upsert(reportItem, {
    transaction: trans
  });
  return [report, created];
};

module.exports = {
  upsertReport
};
