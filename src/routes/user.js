const express = require("express");
const userRouter = express.Router();
const { login } = require("../services/user");
const { success, error, validation } = require("../middlewares/respone");
const { verifyToken } = require("../middlewares/auth");
const User = require("../../models/User");
const Role = require("../../models/Role");

userRouter.post("/login", async (req, res) => {
  const { idCampus, idToken } = req.body;
  if (!idCampus || !idToken) {
    res.status(400).json(validation());
  }
  try {
    const respone = await login(idCampus, idToken);
    if (respone == null) {
      res
        .status(400)
        .json(error((message = "Login failed"), (statusCode = 400)));
    }
    res.json(success((message = "Login successfully"), (results = respone)));
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
userRouter.post("/test-auth", verifyToken, async (req, res) => {
  res.send("OK");
});
module.exports = userRouter;
