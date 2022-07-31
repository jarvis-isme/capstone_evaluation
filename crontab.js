const cron = require("node-cron");
const Semeter = require("./models/Semeter");
const { Op } = require("sequelize");
const CapstoneTeam = require("./models/CapstoneTeam");

const updateCapstoneTeam = cron.schedule("* * * * *", async () => {
  console.log("start crontab update status capstone team");
  const now = Date.now();
  console.log(now);
  const semester = await Semeter.findAll({
    where: {
      end_at: {
        [Op.lte]: now,
      },
    },
  });
  for (i = 0; i < semester?.length; i++) {
    await CapstoneTeam.update(
      {
        status: "0",
      },
      {
        where: {
          semeter_id: semester[i].id,
        },
      }
    );
  }
  console.log("end crontab update status capstont team");
});

module.exports = { updateCapstoneTeam };
