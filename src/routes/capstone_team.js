const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { getAllCapstoneTeam } = require("../services/capstone_team");
const capstoneTeamRouter = express.Router();
const { success, error, validation } = require("../middlewares/respone");
const Semeter = require("../../models/Semeter");

capstoneTeamRouter.get("/search", verifyToken, async (req, res) => {
  const user = req.user;
  const semesterCode = req.query.code ? req.query.code : "";
  console.log(semesterCode);
  const semester = await Semeter.findOne({
    where: {
      code: semesterCode,
    },
  });
  if (semesterCode && !semester) {
    res.status(400).json(validation());
  }
  try {
    const response = await getAllCapstoneTeam(user, semesterCode);
    res.json(
      success(
        (message = "Get capstone team successfully"),
        (results = response)
      )
    );
  } catch (e) {
    console.log(e);
  }
});
module.exports = capstoneTeamRouter;
