const express = require("express");
const Report = require("../../models/Report");
const gradeRouter = express.Router();
const { success, error, validation } = require("../middlewares/respone");
const { getFormSubmitGrade } = require("../services/grade");
const { verifyToken } = require("../middlewares/auth");

gradeRouter.get("/:code", verifyToken, async (req, res) => {
  const code = req.params.code;
  const report = await Report.findOne({
    where: {
      code: code,
    },
  });
  const user = req.user;
  if (!report) {
    res.json(validation());
  }
  try {
    const response = await getFormSubmitGrade(report, user);
    res.json(success((message = "Get Form Grade "), (results = response)));
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

module.exports = gradeRouter;
