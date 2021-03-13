const {Model,DataTypes} = require('sequelize');
const sequelize = require('./conexion');

const detallePedidos = require('./Tabla_Pedidos');

class Pedidos extends Model{}

Pedidos.init({
    id : {
        type : DataTypes.INTEGER, 
        primaryKey : true,
        autoIncrement : true
    },
     
     metodo_pago : DataTypes.STRING,
     
     total_pedido : DataTypes.INTEGER
},{
    sequelize,
    modelName : "Pedidos"
},{
    timestamps : false
});


Pedidos.hasMany(detallePedidos);


module.exports = Pedidos;

