const CapstoneTeam = require("../../models/CapstoneTeam");
const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");
// insert or update capstone team
const upsertCaptoneTeam = async (capstoneTeamItem, trans) => {
  const [capstoneTeam, created] = await CapstoneTeam.upsert(capstoneTeamItem, {
    transaction: trans,
  });
  return [capstoneTeam, created];
};

// get capstone team id by topic code
const getCapTeamIdByTopicCode = async (topic_code) => {
  const resultQuery = await sequelize.query(
    `SELECT capstone_teams.id as capstone_team_id from capstone_teams inner join topics t on capstone_teams.topic_id = t.id where t.code = '${topic_code}';`,
    { type: QueryTypes.SELECT }
  );
  return resultQuery;
};
module.exports = {
  upsertCaptoneTeam,
  getCapTeamIdByTopicCode,
};
