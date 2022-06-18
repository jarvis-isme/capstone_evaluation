const express = require("express");
const campusRouter = express.Router();
const { getAllCampus } = require("../services/campus");
const { success, error, validation } = require("../middlewares/respone");
const Campus = require("../../models/Campus");

campusRouter.get("/get-all-campus", async (req, res) => {
  try {
    const response = await getAllCampus();
    console.log(response);
    res.json(success((message = "Get All Succesfully"), (results = response)));
  } catch (e) {
    console.log(e);
    res.status(500).json(error());
  }
});
campusRouter.get("/dummy", async (req, res) => {
  try {
    const respone = await Campus.create({
      name: "FPTU Ha Noi",
      code: "HN",
    });
  } catch (e) {}
  res.send("OK");
});

module.exports = campusRouter;
