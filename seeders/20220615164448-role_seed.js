"use strict";
const roles = [
  {
    name: "Teacher",
    code: "TE",
  },
  {
    name: "Admin",
    code: "AD",
  },
  {
    name: "Student",
    code: "ST",
  },
  {
    name: "Supervisor",
    code: "SU",
  },
  {
    name: "Secrectary",
    code: "SE",
  },
  {
    name: "Member Council",
    code: "MECO",
  },
  {
    name: "Member Capstone",
    code: "MECA",
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {},

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
