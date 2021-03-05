const {Model,DataTypes} = require('sequelize');
const sequelize = require('./conexion');
const Pedidos = require('./Pedidos');
const pedidos = require('./Pedidos');

class Estados extends Model{}

Estados.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
       

    },
    estados : {
        type : DataTypes.STRING,
       
        
    }
},{
    sequelize,
    modelName : "Estados"
});

Estados.hasMany(Pedidos);
Pedidos.belongsTo(Estados);

module.exports = Estados;