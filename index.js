const express = require('express');
const app = express();
const config = require('./Config/config');
const DB = require('./Models/conexion');
const routerUsuario = require('./Routers/Usuarios_Router');
const routerProducto = require('./Routers/Producto_Router');
const routerPedido = require('./Routers/Pedido_Router');
const routerInicial = require('./Routers/Inicial');
app.use(express.json());


app.use(routerInicial);
app.use('/usuario',routerUsuario);
app.use('/producto',routerProducto);
app.use('/pedido',routerPedido);

app.listen(config.PORT,()=>{
    console.log('Starting Port .....');
    DB.sync({force : false}).then(()=>{
        console.log('Connected DataBase Succesfull');
    }).catch(error=>{
        console.log(error);
    });
});

