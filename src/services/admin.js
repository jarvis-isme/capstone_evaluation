const CapstoneCouncil = require("../../models/CapstoneCouncil");
const CapstoneTeam = require("../../models/CapstoneTeam");
const Room = require("../../models/Room");
const User = require("../../models/User");
const UserRole = require("../../models/UserRole");
const moment = require("moment");
const Report = require("../../models/Report");
const { Op } = require("sequelize");
const ROLES = require("../../constant/role");
const Grade = require("../../models/Grade");
const File = require("../../models/File");
const Setting = require("../../models/Setting");
const CouncilLocation = require("../../models/CouncilLocation");
const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");
const Semeter = require("../../models/Semeter");
const Topic = require("../../models/Topic");

// insert councils team
const insertCouncils = async (councils) => {
  var count = 0;
  var length = councils.length;
  try {
    for (i = 0; i < length; i++) {
      const item = councils[i];
      const chairman = item["Chairman"];
      const councilCode = item["Council Code"];
      const secrectary = item["Secrectary"];
      const firstMember = item["Member 1"];
      const secondMember = item["Member 2"];
      const thirdMember = item["Member 3"];
      const capstoneTeamCode = item["Capstone team Code"];
      const location = item["Location"];
      const date = item["Date"];
      const time = item["Time"];
      const type = item["Type"];

      const room = await Room.findOne({
        where: {
          code: location,
        },
      });
      let isValid = true;
      const capstoneTeam = await CapstoneTeam.findOne({
        where: {
          code: capstoneTeamCode,
        },
      });
      let dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

      if (
        room === null ||
        capstoneTeam === null ||
        councilCode === null ||
        type === null ||
        date === null ||
        time === null ||
        dateRegex.test(date) === false
      ) {
        isValid = false;
      }

      const codes = [
        chairman,
        secrectary,
        firstMember,
        secondMember,
        thirdMember,
      ];

      for (j = 0; j < codes.length; j++) {
        const user = await User.findOne({
          where: {
            code: codes[j],
          },
        });
        if (!user) {
          isValid = false;
        }
      }
      if (isValid) {
        count++;
        let council = await CapstoneCouncil.findOne({
          where: {
            code: councilCode,
          },
        });
        if (!council) {
          council = await CapstoneCouncil.create({
            code: councilCode,
            status: true,
          });
        }

        const ROLE_MAP = {
          0: 7,
          1: 8,
        };

        councilsTeams = [];

        let columns = await Setting.findAll({
          where: {
            code: "M001",
          },
        });
        columns.forEach((column) => {
          column.dataValues.mark = parseFloat("0");
        });
        codes.forEach(async (code, index) => {
          const user = await User.findOne({
            where: {
              code: code,
            },
          });

          councilsTeams.push({
            grade_by: user.id,
            name: user.name,
            marks: columns,
          });
          let params = {
            role_id: ROLE_MAP[index] ? ROLE_MAP[index] : 9,
            capstone_council_id: council?.id,
          };
          if (index > 1) {
            params.user_id = user.id;
          }
          let userRole = await UserRole.findOne({
            where: params,
          });
          if (!userRole) {
            userRole = UserRole.create({
              userId: user.id,
              roleId: ROLE_MAP[index] ? ROLE_MAP[index] : 9,
              councilTeamId: council.id,
            });
          }

          userRole.userId = user.id;
        });

        const teamRole = await UserRole.findOne({
          where: {
            role_id: null,
            capstone_council_id: council?.id,
            capstone_team_id: capstoneTeam.id,
            user_id: null,
          },
        });

        if (!teamRole) {
          let teamRole = await UserRole.create({
            councilTeamId: council.id,
            capstoneTeamId: capstoneTeam.id,
            userId: null,
            roleId: null,
          });
        }

        // init report
        let report = await Report.findOne({
          where: {
            type: parseInt(type),
            capstone_team_id: capstoneTeam.id,
          },
        });
        if (!report) {
          report = await Report.create({
            code: `report${capstoneTeam.id}${type}`,
            capstone_team_id: capstoneTeam.id,
            description: "Report đồ án cuối kì",
            start_at: moment(date, "DD/MM/YYYY").subtract(14, "days").format(),
            end_at: moment(date, "DD/MM/YYYY").subtract(7, "days").format(),
            date_grade: moment(date + time, "DD/MM/YYYY HH:mm").format(),
            name: "Report đồ án cuối kì",
            type: parseInt(type),
          });
        }
        updatedReport = await Report.update(
          {
            type: parseInt(type),
            description: "Report đồ án cuối kì",
            start_at: moment(date, "DD/MM/YYYY").subtract(14, "days").format(),
            end_at: moment(date, "DD/MM/YYYY").subtract(7, "days").format(),
            date_grade: moment(date + time, "DD/MM/YYYY HH:mm").format(),
            name: "Report đồ án cuối kì",
          },
          {
            where: {
              id: report.id,
            },
          }
        );
        // init location
        roomReport = await CouncilLocation.findOne({
          where: {
            room_id: room.id,
            council_id: council.id,
            report_id: report.id,
          },
        });
        if (!roomReport) {
          await CouncilLocation.create({
            room_id: room.id,
            council_id: council.id,
            report_id: report.id,
          });
        }
        // init grades
        capstoneTeams = await UserRole.findAll({
          where: {
            capstone_team_id: capstoneTeam.id,
            role_id: { [Op.in]: [ROLES.MEMBER, ROLES.LEADER] },
            status: false,
          },
        });
        capstoneTeams.forEach(async (member) => {
          let grade = await Grade.findOne({
            where: {
              reportId: report.id,
              userId: member.userId,
            },
          });
          if (!grade) {
            grade = await Grade.create({
              reportId: report.id,
              userId: member.userId,
              gradeDetail: { grades: councilsTeams },
              totalGrade: parseFloat("0"),
            });
          }
        });
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    return {
      count: count,
    };
  }
};

//utils handle council
const handleObjTempCouncil = (row, index) => {
  let obj = {
    capstone_council_code: row.capstone_council_code,
    semeter_name: row.semeter_name,
    index: "",
    chairman: "",
    secretary: "",
    member: "",
  };
  switch (row.role_id) {
    case ROLES.CHAIRMAN:
      obj.chairman = row.user_name;
      break;
    case ROLES.SECRETARY:
      obj.secretary = row.user_name;
      break;
    case ROLES.MEMBERCOUNCIL:
      obj.member += row.user_name + ", ";
      break;
  }
  return obj;
};

//utils handle council
const handleAddRoleCouncil = (data, row) => {
  let index = data.findIndex(
    (item) => item.capstone_council_code === row.capstone_council_code
  );
  switch (row.role_id) {
    case ROLES.CHAIRMAN:
      data[index].chairman = row.user_name;
      break;
    case ROLES.SECRETARY:
      data[index].secretary = row.user_name;
      break;
    case ROLES.MEMBERCOUNCIL:
      data[index].member += row.user_name + ", ";
      break;
  }
  return data;
};

// get all council teams
const getAllCouncilTeams = async () => {
  let data = null;

  const result = await sequelize.query(
    `SELECT
    cc.id as id,
    cc.code as capstone_council_code,
    u.name as user_name,
    ur.role_id as role_id
    FROM users u
    inner join user_roles ur on u.id = ur.user_id
    inner join capstone_councils cc on cc.id = ur.capstone_council_id
  order by
  cc.id desc`,
    { type: QueryTypes.SELECT }
  );
  for (let i = 0; i < result.length; i++) {
    if (data === null) {
      data = [];
      data.push(handleObjTempCouncil(result[i]));
    } else {
      if (
        data.find(
          (item) =>
            item.capstone_council_code === result[i].capstone_council_code
        ) === undefined
      ) {
        data.push(handleObjTempCouncil(result[i]));
      } else {
        data = handleAddRoleCouncil(data, result[i]);
      }
    }
  }
  // remove ", " from member_name and mentor_name
  if (data) {
    for (let i = 0; i < data.length; i++) {
      data[i].member = data[i].member.slice(0, -2);
      data[i].index = i + 1;
    }
  }
  return data;
};

// get alll capstone teams
const getAllCapstoneTeams = async (req, res) => {
  let data = null;

  const result = await sequelize.query(
    `SELECT 
      ct.code as capstone_team_code,
      s.name as semeter_name,
      t.name as topic_name,
      ct.status as capstone_team_status,
      u.name as user_name,
      u.code as user_code,ur.role_id 
    FROM users u
      inner join user_roles ur on u.id = ur.user_id
      inner join capstone_teams ct on ct.id = ur.capstone_team_id
      inner join semeters s on ct.semeter_id = s.id
      inner join topics t on ct.topic_id = t.id;`,
    { type: QueryTypes.SELECT }
  );
  for (let i = 0; i < result.length; i++) {
    if (data === null) {
      data = [];
      data.push(handleObjTemp(result[i]));
    } else {
      if (
        data.find(
          (item) => item.capstone_team_code === result[i].capstone_team_code
        ) === undefined
      ) {
        data.push(handleObjTemp(result[i]));
      } else {
        data = handleAddRole(data, result[i]);
      }
    }
  }
  // remove ", " from member_name and mentor_name
  if (data) {
    for (let i = 0; i < data.length; i++) {
      data[i].member_name = data[i].member_name.slice(0, -2);
      data[i].mentor_name = data[i].mentor_name.slice(0, -2);
    }
  }

  return data;
};

const handleObjTemp = (row) => {
  let obj = {
    capstone_team_code: row.capstone_team_code,
    semeter_name: row.semeter_name,
    capstone_team_status: row.capstone_team_status,
    topic_name: row.topic_name,
    leader_name: "",
    member_name: "",
    mentor_name: "",
  };
  switch (row.role_id) {
    case ROLES.LEADER:
      obj.leader_name = row.user_name;
      break;
    case ROLES.MEMBER:
      obj.member_name += row.user_name + ", ";
      break;
    case ROLES.MENTOR:
      obj.mentor_name += row.user_name + ", ";
      break;
  }
  return obj;
};

const handleAddRole = (data, row) => {
  let index = data.findIndex(
    (item) => item.capstone_team_code === row.capstone_team_code
  );
  switch (row.role_id) {
    case ROLES.LEADER:
      data[index].leader_name = row.user_name;
      break;
    case ROLES.MEMBER:
      data[index].member_name += row.user_name + ", ";
      break;
    case ROLES.MENTOR:
      data[index].mentor_name += row.user_name + ", ";
      break;
  }
  return data;
};

const getDetailCapstoneTeam = async (capstoneTeam) => {
  let detailCapstoneTeam = null;
  const teamInfoQuery = `select
  u.name as student_name,
  u.id as student_id,
  ur.status,
  t.name as topic_name,
  t.code as topic_code,
  t.description as description,
  ur.role_id as role_id
  from users u join user_roles ur on u.id = ur.user_id
     join capstone_teams ct on ur.capstone_team_id = ct.id
     join topics t on ct.topic_id = t.id
     join semeters s on ct.semeter_id = s.id
    where ct.id = ${capstoneTeam.id}`;
  const teamInfos = await sequelize.query(teamInfoQuery, {
    type: QueryTypes.SELECT,
  });
  const members = [];
  const infor = {
    topic_code: teamInfos ? teamInfos[0].topic_code : null,
    topic_name: teamInfos ? teamInfos[0].topic_name : null,
    topic_description: teamInfos ? teamInfos[0].description : null,
  };
  teamInfos?.forEach((teamInfor) => {
    members.push({
      name: teamInfor?.student_name,
      id: teamInfor?.student_id,
      role_id: teamInfor.role_id,
      status: teamInfor?.status,
    });
  });
  let reports = [];
  const reportQuery = `select
    u.name as student_name,
    u.id as student_id,
    r.date_grade,
    r.type as report_type,
    r.id ,
    r.name as report_name,
    r2.name as room_name,
    f.id as file_id,
    f.name as file_name,
    f.path as file_path,
    f.type as file_type,
    f.status as file_status,
    r.id as report_id,
    g.grade_detail,
    g.total_grade
    from users u join grades g on u.id = g.user_id
      join reports r on g.report_id = r.id
      left join files f on f.report_id = r.id 
      left join council_locations cl on r.id = cl.report_id
      left join rooms r2 on r2.id = cl.room_id
      join capstone_teams ct on r.capstone_team_id = ct.id
    where ct.id = ${capstoneTeam.id}
 `;
  let reportQueries = await sequelize.query(reportQuery, {
    type: QueryTypes.SELECT,
  });

  let councils = [];
  reportQueries?.forEach((report) => {
    let gradeDetails = report.grade_detail.grades;
    let marks = [];
    gradeDetails.forEach(async (gradeDetail) => {
      // add column councils
      const found = councils.find(
        (element) => element.id === gradeDetail.grade_by
      );
      if (!found) {
        councils.push({
          id: gradeDetail.grade_by,
          name: gradeDetail.name,
          dataIndex: gradeDetail.grade_by,
          title: gradeDetail.name,
          width: 100,
        });
      }
      let totalGrade = 0;
      gradeDetail.marks.forEach((mark) => {
        totalGrade += mark.value * mark.mark;
      });
      marks.push({
        grade_by: gradeDetail.grade_by,
        name: gradeDetail.name,
        totalGrade: totalGrade,
      });
    });

    // check report is in reponse data
    let key = -1;
    reports?.forEach((detail, index) => {
      if (detail.report_id == report.report_id) {
        key = index;
        return;
      }
    });

    if (key === -1) {
      reports.push({
        report_id: report.report_id,
        report_type: report.report_type,
        room: report.room,
        report_name: report.report_name,
        date_grade: report.date_grade,
        students: [
          {
            name: report.student_name,
            id: report.student_id,
            marks: marks,
            totalGrade: report.totalGrade,
          },
        ],
        files: [
          {
            file_id: report.file_id,
            file_name: report.file_name,
            file_path: report.file_path,
            file_type: report.file_type,
            file_status: report.file_status,
          },
        ],
        councils: councils,
        marks: [],
      });
    } else {
      const isExistStudent = reports[key].students.find((element) => {
        return element.id === report.student_id;
      });
      if (!isExistStudent) {
        reports[key].students.push({
          name: report.student_name,
          id: report.student_id,
          marks: marks,
          totalGrade: report.totalGrade,
        });
      }
      const isExistFile = reports[key].files.find((element) => {
        return element.file_id === report.file_id;
      });
      if (!isExistFile && report.file_status === true) {
        reports[key].files.push({
          file_id: report.file_id,
          file_name: report.file_name,
          file_path: report.file_path,
          file_type: report.file_type,
          file_status: report.file_status,
        });
      }
    }
  });
  detailCapstoneTeam = {
    infor: infor,
    members: members,
    reports: reports,
  };
  return detailCapstoneTeam;
};
const insertCapstoneTeams = async (teams) => {
  let count = 0;
  for (i = 0; i < teams?.length; i++) {
    const item = teams[i];
    const capstoneteamCode = item["capstone_team_code"];
    const semesterCode = item["semeter_code"];
    const topicCode = item["topic_code"];
    const topicDescription = item["topic_description"];
    const leaderCode = item["leader_code"];
    const mentorCodes = item["mentor_code"].split(",");
    let memberCodes = item["member_code"].split(",");
    memberCodes.unshift(leaderCode);
    const topicName = item["topic_name"];
    let isValid = true;
    const semester = await Semeter.findOne({
      where: { code: semesterCode },
    });
    if (!capstoneteamCode || !topicCode || !topicName || !semester) {
      isValid = false;
    }

    const tests = memberCodes.concat(mentorCodes);
    for (j = 0; j < tests.length; j++) {
      const user = await User.findOne({
        where: {
          code: tests[j].trim(),
        },
      });
      if (!user) {
        isValid = false;
      }
    }
    if (isValid) {
      console.log("Start to insert");
      count++;
      const [topic, created] = await Topic.upsert({
        code: topicCode,
        description: topicDescription,
        name: topicName,
      });
      const [capstoneTeam, capstoneTeamcreated] = await CapstoneTeam.upsert({
        status: 1,
        code: capstoneteamCode,
        semeter_id: semester.id,
        topic_id: topic.id,
      });
      for (j = 0; j < memberCodes.length; j++) {
        const user = await User.findOne({
          where: {
            code: memberCodes[j].trim(),
          },
        });
        console.log(user);
        let role = await UserRole.findOne({
          where: {
            councilTeamId: null,
            capstoneTeamId: capstoneTeam.id,
            roleId: j === 0 ? 3 : 4,
            userId: user.id,
          },
        });
        if (!role) {
          role = await UserRole.create({
            capstoneTeamId: capstoneTeam.id,
            roleId: j === 0 ? 3 : 4,
            userId: user.id,
          });
        }
      }

      // insert mentorCodes
      for (j = 0; j < mentorCodes.length; j++) {
        const user = await User.findOne({
          where: {
            code: mentorCodes[j].trim(),
          },
        });
        console.log(user);
        let role = await UserRole.findOne({
          where: {
            councilTeamId: null,
            capstoneTeamId: capstoneTeam.id,
            roleId: 5,
            userId: user.id,
          },
        });
        if (!role) {
          role = await UserRole.create({
            capstoneTeamId: capstoneTeam.id,
            roleId: 5,
            userId: user.id,
          });
        }
      }
    }
  }
  return { count: count };
};
const getDetailCapstoneCouncil = async (code) => {
  let result = null;

  // get location
  const locationQuery = `
  SELECT r.id,r.name,r.code 
  FROM capstone_councils cc join council_locations cl on cc.id = cl.council_id
                            join rooms r on cl.room_id = r.id
  WHERE cc.code = '${code}' group by r.id,r.name,r.code;`;
  const location = await sequelize.query(locationQuery, {
    type: QueryTypes.SELECT,
  });

  if (location.length > 0) {
    result = {};
    result.room_id = location[0].id;
    result.room_code = location[0].code;
    result.room_name = location[0].name;
    result.topics = [];
  }

  // get topic
  const topicQuery = `
  SELECT t.code as topic_code,t.name as topic_name,ct.code as capstone_team_code,r.date_grade as date_grade,r.type as type 
  FROM topics t join capstone_teams ct on t.id = ct.topic_id
                join reports r on ct.id = r.capstone_team_id
                join council_locations cl on r.id = cl.report_id
                join capstone_councils cc on cl.council_id = cc.id
  WHERE cc.code = '${code}' group by t.code,t.name,ct.code,r.date_grade,r.type;`;
  const topics = await sequelize.query(topicQuery, {
    type: QueryTypes.SELECT,
  });

  if (topics.length > 0) {
    let topicResult = [];
    for (let [index, topic] of topics.entries()) {
      const mentorsQuery = `
      SELECT u.name 
      FROM capstone_teams ct join user_roles ur on ct.id = ur.capstone_team_id
                              join users u on ur.user_id = u.id
      WHERE ct.code='${topic.capstone_team_code}' and ur.role_id = 5;`;
      const mentors = await sequelize.query(mentorsQuery, {
        type: QueryTypes.SELECT,
      });
      let mentorResult = "";
      for (let mentor of mentors) {
        mentorResult += `${mentor.name}, `;
      }
      mentorResult = mentorResult.substring(0, mentorResult.length - 2);
      topicResult.push({
        no: index + 1,
        topic_code: topic.topic_code,
        topic_name: topic.topic_name,
        capstone_team_code: topic.capstone_team_code,
        date_grade: moment(topic.date_grade).format("DD/MM/YYYY HH:mm"),
        type: topic.type,
        mentors: mentorResult,
      });
    }
    result.topics = topicResult;
  }

  return result;
};
const getGrades = async () => {
  const grades = await Setting.findAll({
    where: {
      code: "M001",
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return grades ? grades : [];
};
module.exports = {
  insertCouncils,
  getAllCouncilTeams,
  getAllCapstoneTeams,
  getDetailCapstoneTeam,
  getDetailCapstoneCouncil,
  insertCapstoneTeams,
  getGrades,
};
