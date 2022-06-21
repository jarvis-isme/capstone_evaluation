"use strict";

const roles = require("../datas/roles.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("roles", roles);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
