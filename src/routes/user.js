const express = require("express");
const userRouter = express.Router();
const { login, getProfileUser, updateAvatarUser } = require("../services/user");
const { success, error, validation } = require("../middlewares/respone");
const { verifyToken } = require("../middlewares/auth");
const User = require("../../models/User");
const Role = require("../../models/Role");
const Campus = require("../../models/Campus");
const Topic = require("../../models/Topic");
const Semeter = require("../../models/Semeter");

userRouter.post("/login", async (req, res) => {
  const { idCampus, idToken } = req.body;
  if (!idCampus || !idToken) {
    res.status(400).json(validation());
  }
  try {
    const user = await login(idCampus, idToken);
    console.log(user);
    let respone =
      user === null
        ? error((message = "Login failed"), (statusCode = 400))
        : success((message = "Login successfully"), (results = user));
    res.status(respone.code).json(respone);
  } catch (e) {
    res.json(error());
    console.log(e);
  }
});
userRouter.post("/test-auth", verifyToken, async (req, res) => {
  res.send("OK");
});

const campuses = require("../../datas/campus.json");
const roles = require("../../datas/roles.json");
const users = require("../../datas/users.json");
const topics = require("../../datas/topics.json");
const semesters = require("../../datas/semester.json");
const capstoneTeams = require("../../datas/capstone_team.json");
const userRoles = require("../../datas/user_roles.json");
const CapstoneTeam = require("../../models/CapstoneTeam");
const UserRole = require("../../models/UserRole");
const settings = require("../../datas/settings.json");
const Setting = require("../../models/Setting");
userRouter.post("/dummy-data", async (req, res) => {
  const campus = await Campus.bulkCreate(campuses, {
    updateOnDuplicate: ["id"]
  });
  const role = await Role.bulkCreate(roles, {
    updateOnDuplicate: ["id"]
  });
  const user = await User.bulkCreate(users, {
    updateOnDuplicate: ["id"]
  });

  // const topic = await Topic.bulkCreate(topics, {
  //   updateOnDuplicate: ["code"]
  // });

  const semester = await Semeter.bulkCreate(semesters, {
    updateOnDuplicate: ["code"]
  });
  // const capstoneTeaam = await CapstoneTeam.bulkCreate(capstoneTeams, {
  //   updateOnDuplicate: ["code"]
  // });
  const userRole = await UserRole.bulkCreate(userRoles, {});
  const setting = await Setting.bulkCreate(settings, {
    updateOnDuplicate: ["id"]
  });
  res.send("OK");
});

// get profile user
userRouter.get("/profile", verifyToken, async (req, res) => {
  const userCode = req.query.code;
  try {
    if (userCode) {
      const user = await getProfileUser(userCode);
      res.json(success((message = "Get Profile"), (results = user)));
    } else {
      throw "User code is required";
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error);
  }
});

// update avatar
userRouter.put("/profile", verifyToken, async (req, res) => {
  const { avatar, code } = req.body;
  console.log(avatar, code);
  try {
    await updateAvatarUser(avatar, code);
    res.json(success((message = "Update Profile"), (results = null)));
  } catch (e) {
    console.log(e);
    res.status(500).send(error);
  }
});

module.exports = userRouter;
