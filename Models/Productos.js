const {Model, DataTypes} = require('sequelize');
const sequelize = require('./conexion');
const Usuarios = require('./Usuarios');

// const Favoritos = require('./Favoritos');

class Producto extends Model{}
Producto.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
     name : DataTypes.STRING,
     description : DataTypes.STRING(255),
     price : DataTypes.DOUBLE,
     image : DataTypes.STRING(255),
     stock : DataTypes.BOOLEAN,


},{
    sequelize,
    modelName : "Producto"
},{
    timestamps : false
});


module.exports = Producto;
