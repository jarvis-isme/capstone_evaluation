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
const {
  insertCouncils,
  getAllCouncilTeams,
  getAllCapstoneTeams,
  getDetailCapstoneTeam,
} = require("../services/admin");

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
    const data = await getAllCapstoneTeams();
    res.json(
      success((message = "get capstone team successfully"), (results = data))
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

// get capstone council
adminRouter.get("/get-captone-council", async (req, res) => {
  try {
    const data = await getAllCouncilTeams();
    res.json(
      success((message = "get capstone council successfully"), (results = data))
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

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

adminRouter.get("/capstone-team/:code", async (req, res, next) => {
  const code = req.params.code;
  const capstoneTeam = await CapstoneTeam.findOne({
    where: {
      code: code,
    },
  });
  if (!code) {
    res.status(400).json(validation());
  }
  try {
    const response = await getDetailCapstoneTeam(capstoneTeam);

    res.json(
      success(
        (message = "Get Detail Capstone Team Succesfully"),
        (results = response)
      )
    );
  } catch (e) {
    console.log(e);
    next((e.code = 500));
  }
});

module.exports = adminRouter;
