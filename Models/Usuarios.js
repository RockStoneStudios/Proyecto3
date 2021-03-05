const {Model,DataTypes} = require('sequelize');
const sequelize = require('./conexion');
// const Favoritos = require('./Favoritos');
const Pedidos = require('./Pedidos');
const Producto = require('./Productos');

class Usuario extends Model {}

Usuario.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
     username : DataTypes.STRING,
     fullname : DataTypes.STRING,
     email : DataTypes.STRING,
     phone : DataTypes.STRING,
     address : DataTypes.STRING,
     password : DataTypes.STRING,
     admin : DataTypes.BOOLEAN
    
},{
    sequelize ,
    modelName : "Usuario"
},
{
    timestamps : false
});

Usuario.hasMany(Pedidos);
// Usuario.hasMany(Producto,{throug : Favoritos});
module.exports = Usuario;