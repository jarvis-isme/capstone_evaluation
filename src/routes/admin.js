const express = require("express");
const adminRouter = express.Router();
const { success, error } = require("../middlewares/respone");
// model
const Semeter = require("../../models/Semeter");
const Topic = require("../../models/Topic");
const CapstoneTeam = require("../../models/CapstoneTeam");
const User = require("../../models/User");
const Room = require("../../models/Room");
const CapstoneCouncil = require("../../models/CapstoneCouncil");
const Report = require("../../models/Report");
// sevice
const { upsertTopic } = require("../services/topic");
const {
  upsertCaptoneTeam,
  getCapTeamIdByTopicCode
} = require("../services/capstoneTeam");
const { upsertUserRole } = require("../services/userRole");
const { upsertCaptoneCouncil } = require("../services/capstoneCouncil");
const { insertCouncilLocation } = require("../services/councilLocation");
const { upsertReport } = require("../services/report");

const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");

const ROLES = require("../../constant/role");

const moment = require("moment");

adminRouter.post("/insert-capstone-team", async (req, res) => {
  try {
    let { data } = req.body;
    const t1 = await sequelize.transaction();
    const t2 = await sequelize.transaction();
    const t3 = await sequelize.transaction();

    // insert or update Topic
    try {
      for (row of data) {
        let topicItem = {
          code: row.code_topic_name,
          name: row.topic_name,
          description: "not null"
        };
        await upsertTopic(topicItem, t1);
      }
      await t1.commit();
    } catch (error) {
      await t1.rollback();
      throw error;
    }

    // insert capstone team
    try {
      for (row of data) {
        let capstoneTeamItem = {
          code: row.capstone_team_code,
          name: "Not Null",
          status: row.capstone_team_status,
          semeter_id: await Semeter.findOne({
            where: { code: row.code_semeter_name }
          }).then(semeter => semeter.id),
          topic_id: await Topic.findOne({
            where: { code: row.code_topic_name }
          }).then(topic => topic.id)
        };
        await upsertCaptoneTeam(capstoneTeamItem, t2);
      }
      await t2.commit();
    } catch (error) {
      await t2.rollback();
      throw error;
    }

    // insert user role
    try {
      for (row of data) {
        // insert leader
        for (roleLeader of [ROLES.STUDENT, ROLES.LEADER]) {
          let leaderItem = {
            userId: await User.findOne({
              where: { code: row.code_leader_name_1 }
            }).then(user => user.id),
            capstoneTeamId: await CapstoneTeam.findOne({
              where: { code: row.capstone_team_code }
            }).then(capstoneTeam => capstoneTeam.id),
            councilTeamId: null,
            roleId: roleLeader
          };
          await upsertUserRole(leaderItem, t3);
        }
        // insert member
        let teamLength = row.member_name.split(", ").length;
        for (let i = 0; i < teamLength; i++) {
          for (roleMember of [ROLES.STUDENT, ROLES.MEMBER]) {
            let memberItem = {
              userId: await User.findOne({
                where: { code: row[`code_member_name_${i + 1}`] }
              }).then(user => user.id),
              capstoneTeamId: await CapstoneTeam.findOne({
                where: { code: row.capstone_team_code }
              }).then(capstoneTeam => capstoneTeam.id),
              councilTeamId: null,
              roleId: roleMember
            };
            await upsertUserRole(memberItem, t3);
          }
        }
        // insert mentor
        let councilLength = row.mentor_name.split(", ").length;
        for (let i = 0; i < councilLength; i++) {
          for (roleMentor of [ROLES.LECTURE, ROLES.MENTOR]) {
            let mentorItem = {
              userId: await User.findOne({
                where: { code: row[`code_mentor_name_${i + 1}`] }
              }).then(user => user.id),
              capstoneTeamId: await CapstoneTeam.findOne({
                where: { code: row.capstone_team_code }
              }).then(capstoneTeam => capstoneTeam.id),
              councilTeamId: null,
              roleId: roleMentor
            };
            await upsertUserRole(mentorItem, t3);
          }
        }
      }
      await t3.commit();
    } catch (error) {
      await t3.rollback();
      throw error;
    }
    res.json(success((message = "Insert successfully"), (results = null)));
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

adminRouter.get("/get-captone-team", async (req, res) => {
  try {
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
    let data = null;
    for (let i = 0; i < result.length; i++) {
      if (data === null) {
        data = [];
        data.push(handleObjTemp(result[i]));
      } else {
        if (
          data.find(
            item => item.capstone_team_code === result[i].capstone_team_code
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
    res.json(
      success((message = "get capstone team successfully"), (results = data))
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

const handleObjTemp = row => {
  let obj = {
    capstone_team_code: row.capstone_team_code,
    semeter_name: row.semeter_name,
    capstone_team_status: row.capstone_team_status,
    topic_name: row.topic_name,
    leader_name: "",
    member_name: "",
    mentor_name: ""
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
    item => item.capstone_team_code === row.capstone_team_code
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

// insert capstone council
adminRouter.post("/insert-capstone-council", async (req, res) => {
  try {
    let { data } = req.body;
    let t1 = await sequelize.transaction();
    let t2 = await sequelize.transaction();
    let t3 = await sequelize.transaction();
    let t4 = await sequelize.transaction();
    // insert capstone council
    try {
      for (let i = 0; i < data.length; i++) {
        let capstoneCouncilItem = {
          code: data[i].council.capstone_council_code,
          name: "Not Null",
          status: true,
          semeter_id: await Semeter.findOne({
            where: { code: data[i].council.semeter_name.split("-")[0] }
          }).then(semeter => semeter.id)
        };
        await upsertCaptoneCouncil(capstoneCouncilItem, t1);
      }
      await t1.commit();
    } catch (error) {
      console.log("error insert capstone council", error);
      await t1.rollback();
    }
    // insert report
    try {
      for (let i = 0; i < data.length; i++) {
        let topic = data[i].topic;
        for (let j = 0; j < topic.length; j++) {
          let date_grade = `${topic[j].date} ${topic[j].time}`;
          const resultQuery = await getCapTeamIdByTopicCode(
            topic[j].topic_code
          );
          // console.log(resultQuery[0].capstone_team_id);
          let reportItem = {
            code: `report${resultQuery[0].capstone_team_id}${topic[j].type}`,
            name: "Report đồ án cuối kì",
            description: "Report đồ án cuối kì",
            start_at: moment(date_grade, "DD/MM/YYYY")
              .subtract(14, "days")
              .format(),
            end_at: moment(date_grade, "DD/MM/YYYY")
              .subtract(7, "days")
              .format(),
            submit_date: null,
            type: topic[j].type,
            date_grade: moment(date_grade, "DD/MM/YYYY HH:mm").format(),
            capstone_team_id: resultQuery[0].capstone_team_id
          };
          await upsertReport(reportItem, t2);
        }
      }
      await t2.commit();
    } catch (error) {
      console.log("error insert report", error);
      await t2.rollback();
    }
    // insert council location
    try {
      for (let i = 0; i < data.length; i++) {
        let topic = data[i].topic;
        for (let j = 0; j < topic.length; j++) {
          const resultQuery = await getCapTeamIdByTopicCode(
            topic[j].topic_code
          );
          // console.log(resultQuery[0].capstone_team_id);
          let councilLocationItem = {
            room_id: await Room.findOne({
              where: { code: data[i].location.split("-")[0] }
            }).then(room => room.id),
            council_id: await CapstoneCouncil.findOne({
              where: { code: data[i].council.capstone_council_code }
            }).then(council => council.id),
            report_id: await Report.findOne({
              where: {
                code: `report${resultQuery[0].capstone_team_id}${topic[j].type}`
              }
            }).then(report => report.id)
          };
          await insertCouncilLocation(councilLocationItem, t3);
        }
      }
      await t3.commit();
    } catch (error) {
      await t3.rollback();
      console.log("error insert council location", error);
    }
    // insert user role
    try {
      // insert chairman
      for (let i = 0; i < data.length; i++) {
        for (roleChairman of [ROLES.LECTURE, ROLES.CHAIRMAN]) {
          let chairmanItem = {
            userId: await User.findOne({
              where: { code: data[i].council.chairman.split("-")[0] }
            }).then(user => user.id),
            capstoneTeamId: null,
            councilTeamId: await CapstoneCouncil.findOne({
              where: { code: data[i].council.capstone_council_code }
            }).then(council => council.id),
            roleId: roleChairman
          };
          await upsertUserRole(chairmanItem, t4);
        }
      }
      // insert secretary
      for (let i = 0; i < data.length; i++) {
        for (roleSecretary of [ROLES.LECTURE, ROLES.SECRETARY]) {
          let secretaryItem = {
            userId: await User.findOne({
              where: { code: data[i].council.secretary.split("-")[0] }
            }).then(user => user.id),
            capstoneTeamId: null,
            councilTeamId: await CapstoneCouncil.findOne({
              where: { code: data[i].council.capstone_council_code }
            }).then(council => council.id),
            roleId: roleSecretary
          };
          await upsertUserRole(secretaryItem, t4);
        }
      }
      // insert member council
      for (let i = 0; i < data.length; i++) {
        let memberArray = data[i].council.member.split(", ");
        for (let j = 0; j < memberArray.length; j++) {
          for (roleMember of [ROLES.LECTURE, ROLES.MEMBERCOUNCIL]) {
            let memberItem = {
              userId: await User.findOne({
                where: { code: memberArray[j].split("-")[0] }
              }).then(user => user.id),
              capstoneTeamId: null,
              councilTeamId: await CapstoneCouncil.findOne({
                where: { code: data[i].council.capstone_council_code }
              }).then(council => council.id),
              roleId: roleMember
            };
            await upsertUserRole(memberItem, t4);
          }
        }
      }
      await t4.commit();
    } catch (error) {
      console.log("error insert user role", error);
      await t4.rollback();
    }
    res.json(success((message = "Insert successfully"), (results = null)));
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});
// get capstone council
adminRouter.get("/get-captone-council", async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT 
        cc.code as capstone_council_code,
        s.name as semeter_name,
        u.name as user_name,
        ur.role_id as role_id 
      FROM users u 
        inner join user_roles ur on u.id = ur.user_id
        inner join capstone_councils cc on cc.id = ur.capstone_council_id
        inner join semeters s on s.id = cc.semeter_id;`,
      { type: QueryTypes.SELECT }
    );
    let data = null;
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);
      if (data === null) {
        data = [];
        data.push(handleObjTempCouncil(result[i]));
      } else {
        if (
          data.find(
            item =>
              item.capstone_council_code === result[i].capstone_council_code
          ) === undefined
        ) {
          data.push(handleObjTempCouncil(result[i]));
        } else {
          data = handleAddRoleCouncil(data, result[i]);
        }
      }
      // console.log(data);
    }
    // remove ", " from member_name and mentor_name
    if (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].member = data[i].member.slice(0, -2);
        data[i].index = i + 1;
      }
    }
    res.json(
      success((message = "get capstone council successfully"), (results = data))
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});
const handleObjTempCouncil = (row, index) => {
  let obj = {
    capstone_council_code: row.capstone_council_code,
    semeter_name: row.semeter_name,
    index: "",
    chairman: "",
    secretary: "",
    member: ""
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

const handleAddRoleCouncil = (data, row) => {
  let index = data.findIndex(
    item => item.capstone_council_code === row.capstone_council_code
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
module.exports = adminRouter;
