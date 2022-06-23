const express = require("express");
const CapstoneTeam = require("../../models/CapstoneTeam");
const UserRole = require("../../models/UserRole");
const { verifyToken } = require("../middlewares/auth");
const reportRouter = express.Router();
const { success, error, validation } = require("../middlewares/respone");
const { getReportByCode } = require("../services/report");

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
      capstone_team_id: capstoneTeam.id,
    },
  });
  if (!capstoneTeamCode || (capstoneTeamCode && (!capstoneTeam || !role))) {
    res.json(validation());
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

module.exports = reportRouter;
