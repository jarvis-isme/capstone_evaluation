const CapstoneTeam = require("../../models/CapstoneTeam");

// insert or update capstone team
const upsertCaptoneTeam = async (capstoneTeamItem, trans) => {
  const [capstoneTeam, created] = await CapstoneTeam.upsert(capstoneTeamItem, {
    transaction: trans
  });
  return [capstoneTeam, created];
};

module.exports = {
  upsertCaptoneTeam
};
