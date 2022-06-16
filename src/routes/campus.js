const express = require("express");
const campusRouter = express.Router();
const { getAllCampus } = require("../services/campus");
const { success, error, validation } = require("../middlewares/respone");

campusRouter.get("/get-all-campus", async (req, res) => {
  try {
    const response = getAllCampus();
    res.json(success((message = "Get All Succesfully"), response));
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});

module.exports = campusRouter;
