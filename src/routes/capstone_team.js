const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { getAllCapstoneTeam } = require("../services/capstine_team");
const capstoneTeamRouter = express.Router();

capstoneTeamRouter.get("/:semesterId", verifyToken, async (req, res) => {
  const user = req.user;
  const semesterId = req.params.semesterId;
  try {
    console.log(user);
    const respone = await getAllCapstoneTeam(user, semesterId);
    res.send("Oke");
  } catch (e) {
    console.log(e);
  }
});
module.exports = capstoneTeamRouter;
