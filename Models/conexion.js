const {Sequelize} = require('sequelize');
const config = require('../Config/config');


const sequelize = new Sequelize(
     config.DB.database,
     config.DB.username,
     config.DB.password,
     {
         host : config.DB.host,
         dialect: "mysql"
     }
);

module.exports = sequelize;