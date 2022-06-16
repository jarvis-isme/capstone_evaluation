const express = require("express");
const userRouter = express.Router();
const { login } = require("../services/user");
const { success, error, validation } = require("../middlewares/respone");

userRouter.post("/login", (req, res) => {
  const { idCampus, idToken } = req.body;
  if (!idCampus || !idToken) {
    res.status(400).json(validation());
  }
  try {
    const respone = login(idCampus, idToken);
  } catch (e) {}
});

module.exports = userRouter;
