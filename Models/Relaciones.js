const app = require('../index');
const Usuario = require('./Usuarios');
const Pedido = require('./Pedidos');
const detalle_pedido = require('./Tabla_Pedidos');


//Un Usuario Puede hacer 1 o muchos Pedidos un Pedido Pertenece a un Usuario
Usuario.hasMany(Pedido);
Pedido.belongsTo(Usuario);

// Un Pedido tiene uno o muchos detalles de pedido , un detalle de pedido pertenece a un solo pedido
Pedido.hasMany(detalle_pedido);
detalle_pedido.belongsTo(Pedido);

