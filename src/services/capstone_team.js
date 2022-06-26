const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");
const getAllCapstoneTeam = async (user, semesterCode) => {
  let response = [];

  const userId = user.id;
  const rawQuery = `select S.id as semester_id,


  S.name as semester_name,


  C.code as capstone_team_code,


  T.name as topic_name,
  U.role_id as role_id,

  T.description as topic_description,


  T.code,


  C.status


  from semeters S


  join capstone_teams C on S.id = C.semeter_id


  join topics T on C.topic_id = T.id


  join user_roles U on U.capstone_team_id = C.id

  where U.user_id =${userId}  and S.code like '%${semesterCode}%'
  order by S.id desc
`;
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
            role_id: item.role_id,
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
        role_id: item.role_id,
      });
    }
  });
  const councilQuery = `select
      C.code as capstone_team_code,
      T.name as topic_name,
      U.role_id as role_id,

      T.description as topic_description,
      T.code,
      C.status
      from semeters S


      join capstone_teams C on S.id = C.semeter_id


      join topics T on C.topic_id = T.id
      join reports  R on C.id = R.capstone_team_id
      join council_locations cl on R.id = cl.report_id
      join capstone_councils cc on cl.council_id = cc.id
    join user_roles u on cc.id = u.capstone_council_id
    where u.user_id =${user.id} and
    DATE_PART('day', r.date_grade - current_date) between  0 and 7`;
  let councils = [];
  query = await sequelize.query(councilQuery, {
    type: QueryTypes.SELECT,
  });
  query?.forEach((item) => {
    let key = -1;
    councils.forEach((data, index) => {
      if (data.semester_id === item.semester_id) {
        key = index;
        return;
      }
    });
    console.log(key);
    if (key === -1) {
      councils.push({
        capstone_teams: [
          {
            code: item.capstone_team_code,
            status: item.status,
            topic: {
              code: item.code,
              description: item.topic_description ? item.topic_description : "",
              name: item.topic_name,
            },
            role_id: item.role_id,
          },
        ],
      });
    } else {
      councils[key].capstone_teams.push({
        code: item.capstone_team_code,
        status: item.status,
        topic: {
          code: item.code,
          description: item.topic_description ? item.topic_description : "",
          name: item.topic_name,
        },
        role_id: item.role_id,
      });
    }
  });

  return {
    capstone_teams: response,
    councils: councils,
  };
};

module.exports = { getAllCapstoneTeam };
