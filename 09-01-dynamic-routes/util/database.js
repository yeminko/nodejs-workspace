const Sequalize = require("sequelize");

const sequelize = new Sequalize("node-complete", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
