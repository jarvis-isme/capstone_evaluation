const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");
const getAllCapstoneTeam = async (user, semesterCode) => {
  let response = [];

  const userId = user.id;
  const rawQuery = `select S.id as semester_id,


  S.name as semester_name,


  C.code as capstone_team_code,


  T.name as topic_name,


  T.description as topic_description,


  T.code,


  C.status


  from semeters S


  join capstone_teams C on S.id = C.semeter_id


  join topics T on C.topic_id = T.id


  join user_roles U on U.capstone_team_id = C.id

  where U.user_id =${userId}  and S.code like '%${semesterCode}%'



  order by S.id desc`;
  const capstoneTeams = await sequelize.query(rawQuery, {
    type: QueryTypes.SELECT,
  });
  const keys = [];
  capstoneTeams.forEach((item) => {
    let key = -1;
    response.forEach((data, index) => {
      if (data.semester_id === item.semester_id) {
        key = index;
        return;
      }
    });
    console.log(key);
    if (key === -1) {
      response.push({
        semester_id: item.semester_id,
        semester_name: item.semester_name,
        capstone_teams: [
          {
            code: item.capstone_team_code,
            status: item.status,
            topic: {
              code: item.code,
              description: item.topic_description ? item.topic_description : "",
              name: item.topic_name,
            },
          },
        ],
      });
    } else {
      response[key].capstone_teams.push({
        code: item.capstone_team_code,
        status: item.status,
        topic: {
          code: item.code,
          description: item.topic_description ? item.topic_description : "",
          name: item.topic_name,
        },
      });
    }
  });
  console.log(response);
  return response;
};

module.exports = { getAllCapstoneTeam };
