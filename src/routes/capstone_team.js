const express = require("express");
const { getAllCapstoneTeam } = require("../services/capstine_team");
const capstoneTeamRouter = express.Router();

capstoneTeamRouter.get("/", (req, res) => {
  const user = req.user;
  try {
    const respone = getAllCapstoneTeam(user);
  } catch (e) {
    console.log(e);
  }
});
module.exports = capstoneTeamRouter;
