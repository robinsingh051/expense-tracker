const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
