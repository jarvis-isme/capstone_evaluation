const express = require("express");
const CapstoneTeam = require("../../models/CapstoneTeam");
const Report = require("../../models/Report");
const UserRole = require("../../models/UserRole");
const { verifyToken } = require("../middlewares/auth");
const reportRouter = express.Router();
const { success, error, validation } = require("../middlewares/respone");
const {
  getReportByCode,
  getDetailReport,
  submitFile,
} = require("../services/report");

reportRouter.get("/:code", verifyToken, async (req, res) => {
  const user = req.user;
  const capstoneTeamCode = req.params.code;
  const capstoneTeam = await CapstoneTeam.findOne({
    where: {
      code: capstoneTeamCode,
    },
  });
  const role = UserRole.findOne({
    where: {
      user_id: user.id,
      capstone_team_id: capstoneTeam?.id,
    },
  });

  if (!capstoneTeamCode || (capstoneTeamCode && (!capstoneTeam || !role))) {
    res.status(400).json(validation());
  }
  try {
    const reports = await getReportByCode(capstoneTeam);
    res.json(
      success((message = "Get report successfully"), (results = reports))
    );
  } catch (e) {
    console.log(e);
    res.json(error());
  }
});

reportRouter.post("/submit", verifyToken, async (req, res) => {
  const user = req.user;
  const { code, path, name, type } = req.body;
  console.log({ code, path, name, type });
  if (!code || !path || !name || type === null) {
    res.status(400).json(validation());
  }
  try {
    const response = await submitFile(code, type, path, name, user);
    res.json(
      success((message = "Upload file succesfully"), (results = response))
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

reportRouter.get("/detail/:code", verifyToken, async (req, res) => {
  const user = req.user;
  const reportCode = req.params.code;
  const report = await Report.findOne({
    where: {
      code: reportCode,
    },
  });
  if (!report || !reportCode) {
    res.status(400).json(validation());
  }
  try {
    detailReport = await getDetailReport(report, user);

    res.json(
      success(
        (message = "Get Detail Report Successfully"),
        (results = detailReport)
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

module.exports = reportRouter;
