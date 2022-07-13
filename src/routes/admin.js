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
  getDetailCapstoneCouncil,
  insertCapstoneTeams,
} = require("../services/admin");

adminRouter.post("/insert-capstone-team", async (req, res, next) => {
  const { teams } = req.body;
  console.log(teams);
  if (!teams) {
    res.status(400).json(validation());
  }
  try {
    const response = await insertCapstoneTeams(teams);
    return res.json(
      success((message = `Imported  rows`), (results = response))
    );
  } catch (e) {
    console.log(e);
    next(e);
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

adminRouter.get("/capstone-council/:code", async (req, res, next) => {
  const code = req.params.code;
  if (!code) {
    res.status(400).json(validation());
  }
  try {
    const response = await getDetailCapstoneCouncil(code);

    res.json(
      success(
        (message = "Get Detail Capstone council Succesfully"),
        (results = response)
      )
    );
  } catch (e) {
    console.log(e);
    next((e.code = 500));
  }
});

module.exports = adminRouter;
