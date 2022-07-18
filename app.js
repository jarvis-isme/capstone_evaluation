const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./db");
const winston = require("winston");
var nodemailer = require("nodemailer");

require("dotenv").config();
var fs = require("fs");
var path = require("path");

const app = express();
const port = process.env.PORT || 8081;

// config access log
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {
      flags: "a",
    }),
  })
);
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "logs", "error.log"), {
      flags: "a",
    }),
  })
);
//config error log
const logger = new winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
  ],
  exitOnError: false,
});
app.use(function (err, req, res, next) {
  logger.error(
    `${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`
  );
  next(err);
});

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(express.json());
//setting router
const campusRouter = require("./src/routes/campus");
app.use("/campus", campusRouter);
const userRouter = require("./src/routes/user");
app.use("/user", userRouter);
const adminRouter = require("./src/routes/admin");
app.use("/admin", adminRouter);
const semesterRouter = require("./src/routes/semester");
app.use("/semester", semesterRouter);
const capstoneTeamRouter = require("./src/routes/capstone_team");
app.use("/capstone-team", capstoneTeamRouter);
const reportRouter = require("./src/routes/report");
app.use("/report", reportRouter);
const gradeRouter = require("./src/routes/grade");
app.use("/grade", gradeRouter);

const { errorHandle } = require("./src/middlewares/errorHandler");
app.use(errorHandle);

app.listen(port, () => {
  console.log(`Sever is listening on port ${port}`);
});
