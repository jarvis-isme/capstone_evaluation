const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { success, error, validation } = require("../middlewares/respone");
const { getAllSemester } = require("../services/semester");
const semesterRouter = express.Router();

semesterRouter.get("/", verifyToken, async (req, res) => {
  try {
    const semesters = await getAllSemester();
    res.json(success((message = "Get All Semesters"), (results = semesters)));
  } catch (e) {
    console.log(e);
    res.status(500).send(error);
  }
});
module.exports = semesterRouter;
