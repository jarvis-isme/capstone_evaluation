const sequelize = require("../../db");
const getAllCapstoneTeam = async (user, semsterId) => {
  let response = {};

  const userId = user.id;
  const rawQuery = `select S.id,
    C.code,
    T.name,
    T.description,
    T.code,
    C.status
    from semeters S
    join capstone_teams C on S.id = C.semeter_id
    join topics T on C.topic_id = T.id
    join user_roles U on U.capstone_team_id = C.id
    where U.user_id =${userId} and S.semsester=${semsterId}
    order by S.id desc`;
  const capstoneTeams = await sequelize.query(rawQuery, {
    type: QueryTypes.SELECT,
  });
  console.log(capstoneTeams);
  return response;
};

module.exports = { getAllCapstoneTeam };
