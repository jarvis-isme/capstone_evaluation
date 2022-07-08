const express = require("express");
const adminRouter = express.Router();
const fs = require("fs");
const { success, error, validation } = require("../middlewares/respone");
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
  getCapTeamIdByTopicCode,
} = require("../services/capstoneTeam");
const { upsertUserRole } = require("../services/userRole");
const { upsertCaptoneCouncil } = require("../services/capstoneCouncil");
const { insertCouncilLocation } = require("../services/councilLocation");
const { upsertReport } = require("../services/report");

const sequelize = require("../../db");
const { QueryTypes } = require("sequelize");

const ROLES = require("../../constant/role");
const moment = require("moment");
const { verifyToken } = require("../middlewares/auth");
const { insertCouncils } = require("../services/admin");

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
          description: "not null",
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
            where: { code: row.code_semeter_name },
          }).then((semeter) => semeter.id),
          topic_id: await Topic.findOne({
            where: { code: row.code_topic_name },
          }).then((topic) => topic.id),
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
              where: { code: row.code_leader_name_1 },
            }).then((user) => user.id),
            capstoneTeamId:
              ROLES.LEADER === roleLeader
                ? await CapstoneTeam.findOne({
                    where: { code: row.capstone_team_code },
                  }).then((capstoneTeam) => capstoneTeam.id)
                : null,
            councilTeamId: null,
            roleId: roleLeader,
          };
          await upsertUserRole(leaderItem, t3);
        }
        // insert member
        let teamLength = row.member_name.split(", ").length;
        for (let i = 0; i < teamLength; i++) {
          for (roleMember of [ROLES.STUDENT, ROLES.MEMBER]) {
            let memberItem = {
              userId: await User.findOne({
                where: { code: row[`code_member_name_${i + 1}`] },
              }).then((user) => user.id),
              capstoneTeamId:
                ROLES.MEMBER === roleMember
                  ? await CapstoneTeam.findOne({
                      where: { code: row.capstone_team_code },
                    }).then((capstoneTeam) => capstoneTeam.id)
                  : null,
              councilTeamId: null,
              roleId: roleMember,
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
                where: { code: row[`code_mentor_name_${i + 1}`] },
              }).then((user) => user.id),
              capstoneTeamId:
                ROLES.MENTOR === roleMentor
                  ? await CapstoneTeam.findOne({
                      where: { code: row.capstone_team_code },
                    }).then((capstoneTeam) => capstoneTeam.id)
                  : null,
              councilTeamId: null,
              roleId: roleMentor,
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
    res.json(
      success((message = "get capstone team successfully"), (results = data))
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

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

// get capstone council
adminRouter.get("/get-captone-council", async (req, res) => {
  try {
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
    let data = null;
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);
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

// post insert
adminRouter.post(
  "/insert-capstone-council",
  verifyToken,
  async (req, res, next) => {
    const { councils } = req.body;
    if (!councils) {
      res.status(400).json(validation());
    }
    try {
      const response = await insertCouncils(councils);

      return res.json(
        success((message = `Imported  rows`), (results = response))
      );
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
);

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
module.exports = adminRouter;
