const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("proyecto_formativo", "alex", "270999", {
    host: "192.168.88.221",
    dialect: "mysql"
});

module.exports = sequelize;
