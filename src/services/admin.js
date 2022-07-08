const CapstoneCouncil = require("../../models/CapstoneCouncil");
const CapstoneTeam = require("../../models/CapstoneTeam");
const Room = require("../../models/Room");
const User = require("../../models/User");
const UserRole = require("../../models/UserRole");
const moment = require("moment");
const Report = require("../../models/Report");
const { Op } = require("sequelize");
const ROLES = require("../../constant/role");
const Grade = require("../../models/Grade");
const Setting = require("../../models/Setting");
const CouncilLocation = require("../../models/CouncilLocation");

const insertCouncils = async (councils) => {
  var count = 0;
  var length = councils.length;
  try {
    for (i = 0; i < length; i++) {
      const item = councils[i];
      const chairman = item["Chairman"];
      const councilCode = item["Council Code"];
      const secrectary = item["Secrectary"];
      const firstMember = item["Member 1"];
      const secondMember = item["Member 2"];
      const thirdMember = item["Member 3"];
      const capstoneTeamCode = item["Capstone team Code"];
      const location = item["Location"];
      const date = item["Date"];
      const time = item["Time"];
      const type = item["Type"];

      const room = await Room.findOne({
        where: {
          code: location,
        },
      });
      let isValid = true;
      const capstoneTeam = await CapstoneTeam.findOne({
        where: {
          code: capstoneTeamCode,
        },
      });
      let dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      console.log(type === null);

      if (
        room === null ||
        capstoneTeam === null ||
        councilCode === null ||
        type === null ||
        date === null ||
        time === null ||
        dateRegex.test(date) === false
      ) {
        isValid = false;
      }

      const codes = [
        chairman,
        secrectary,
        firstMember,
        secondMember,
        thirdMember,
      ];

      for (j = 0; j < codes.length; j++) {
        const user = await User.findOne({
          where: {
            code: codes[j],
          },
        });
        if (!user) {
          console.log("xxs");
          isValid = false;
        }
      }
      if (isValid) {
        console.log("before");
        count++;
        console.log(count);
        console.log("after");
        console.log(isValid);
        let council = await CapstoneCouncil.findOne({
          where: {
            code: councilCode,
          },
        });
        if (!council) {
          council = await CapstoneCouncil.create({
            code: councilCode,
            status: true,
          });
        }

        const ROLE_MAP = {
          0: 7,
          1: 8,
        };

        councilsTeams = [];

        let columns = await Setting.findAll({
          where: {
            code: "M001",
          },
        });
        columns.forEach((column) => {
          column.dataValues.mark = parseFloat("0");
        });
        codes.forEach(async (code, index) => {
          const user = await User.findOne({
            where: {
              code: code,
            },
          });

          councilsTeams.push({
            grade_by: user.id,
            name: user.name,
            marks: columns,
          });
          let params = {
            role_id: ROLE_MAP[index] ? ROLE_MAP[index] : 9,
            capstone_council_id: council?.id,
          };
          if (index > 1) {
            params.user_id = user.id;
          }
          let userRole = await UserRole.findOne({
            where: params,
          });
          if (!userRole) {
            userRole = UserRole.create({
              userId: user.id,
              roleId: ROLE_MAP[index] ? ROLE_MAP[index] : 9,
              councilTeamId: council.id,
            });
          }

          userRole.userId = user.id;
        });

        const teamRole = await UserRole.findOne({
          where: {
            role_id: null,
            capstone_council_id: council?.id,
            capstone_team_id: capstoneTeam.id,
            user_id: null,
          },
        });

        if (!teamRole) {
          let teamRole = await UserRole.create({
            councilTeamId: council.id,
            capstoneTeamId: capstoneTeam.id,
            userId: null,
            roleId: null,
          });
        }

        // init report
        let report = await Report.findOne({
          where: {
            type: parseInt(type),
            capstone_team_id: capstoneTeam.id,
          },
        });
        if (!report) {
          report = await Report.create({
            code: `report${capstoneTeam.id}${type}`,
            capstone_team_id: capstoneTeam.id,
            description: "Report đồ án cuối kì",
            start_at: moment(date, "DD/MM/YYYY").subtract(14, "days").format(),
            end_at: moment(date, "DD/MM/YYYY").subtract(7, "days").format(),
            date_grade: moment(date + time, "DD/MM/YYYY HH:mm").format(),
            name: "Report đồ án cuối kì",
            type: parseInt(type),
          });
        }
        updatedReport = await Report.update(
          {
            type: parseInt(type),
            description: "Report đồ án cuối kì",
            start_at: moment(date, "DD/MM/YYYY").subtract(14, "days").format(),
            end_at: moment(date, "DD/MM/YYYY").subtract(7, "days").format(),
            date_grade: moment(date + time, "DD/MM/YYYY HH:mm").format(),
            name: "Report đồ án cuối kì",
          },
          {
            where: {
              id: report.id,
            },
          }
        );
        // init location
        roomReport = await CouncilLocation.findOne({
          where: {
            room_id: room.id,
            council_id: council.id,
            report_id: report.id,
          },
        });
        if (!roomReport) {
          await CouncilLocation.create({
            room_id: room.id,
            council_id: council.id,
            report_id: report.id,
          });
        }
        // init grades
        capstoneTeams = await UserRole.findAll({
          where: {
            capstone_team_id: capstoneTeam.id,
            role_id: { [Op.in]: [ROLES.MEMBER, ROLES.LEADER] },
            status: false,
          },
        });
        capstoneTeams.forEach(async (member) => {
          let grade = await Grade.findOne({
            where: {
              reportId: report.id,
              userId: member.userId,
            },
          });
          if (!grade) {
            grade = await Grade.create({
              reportId: report.id,
              userId: member.userId,
              gradeDetail: { grades: councilsTeams },
              totalGrade: parseFloat("0"),
            });
          }
        });
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    return {
      count: count,
    };
  }
};

module.exports = {
  insertCouncils,
};
