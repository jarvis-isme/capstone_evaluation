const getAllCapstoneTeam = (user) => {
  let respone;

  const userId = user.id;
  rawQuery = `select S.id,
    S.name,
    C.code,
    T.name,
    T.description,
    T.code,
    C.status
    from semeters S
  join capstone_teams C on S.id = C.semeter_id
  join topics T on C.topic_id = T.id
  join user_roles U on U.capstone_team_id = C.id
  where U.user_id =${userId} and S.
  order by S.id desc`;
  // let response = [
  //   {
  //     semester: "Summer",
  //     capstone_teams: [
  //       {
  //         name: "",
  //         code: "",
  //         status: 0,
  //         topic: {
  //           name: "",
  //           code: "",
  //         },
  //       },
  //     ],
  //   },
  // ];

  query = "";
  return response;
};

module.exports = { getAllCapstoneTeam };
