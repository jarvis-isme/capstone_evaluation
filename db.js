const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  `${process.env.DATABASE_NAME}`,
  `${process.env.DATABASE_USER}`,
  `${process.env.DATABASE_PASSWORD}`,
  {
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    dialect: `postgres`,
    quoteIdentifiers: false, // remove " from table name
  }
);
module.exports = sequelize;
