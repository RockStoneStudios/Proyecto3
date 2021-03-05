const {Model,DataTypes} = require('sequelize');
const sequelize = require('./conexion');
const Pedido = require('./Pedidos');
class Tabla_Pedidos extends Model{}

Tabla_Pedidos.init({
    id : {
         type : DataTypes.INTEGER,
         primaryKey : true,
         autoIncrement : true
    },
    nombre_producto : DataTypes.STRING,
    cantidad_producto : DataTypes.INTEGER,
    precio_total : DataTypes.DOUBLE,
},{
    sequelize,
    modelName : "Tabla_Pedidos"
},{
    timestamps : false
});


module.exports = Tabla_Pedidos;