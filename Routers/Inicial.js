const router = require('express').Router();
const Estados = require('../Models/Estados');
const security = require('../Config/validar');
const Usuario = require('../Models/Usuarios');
const Producto = require('../Models/Productos');




//Agregar Usuarios Iniciales
 router.post('/cargarUsuarios', async(req,res)=>{
     const passwordsAdmin = "3508436568Omar";
     const passwordElon = "12345678E";
     const passwordJeff = "12345678J"
      const usuarios = await Usuario.findAll();
       if(usuarios.length>0) return res.json({message : "Ya se cargaron los Usuarios de Prueba"});
       const nuevosUsuarios = [{
            username : "Omar",
            fullname : "Omar Ortiz",
            email : "RockStoneStudios666@gmail.com",
            phone : "+54 3508436568",
            address : "Medellin Antioquia Crr 65A #93-31",
            password : await security.encryptPassword(passwordsAdmin),
            admin : true
       },{
           username : "Elon",
           fullname : "Elon Musk",
           email : "soyElonMusk@gmail.com",
           phone : "512 40014023",
           address : "Austin Texas  Crr 10C #100-2",
           password : await security.encryptPassword(passwordElon),
           admin : false
       },{
           username : "Jeff",
           fullname : "Jeff Preston Bezos",
           email : "SoyJeffBezos@gmail.com",
           phone : "206 51030084",
           address : "Seattle Washington Crr 2A #84-10 ",
           password : await security.encryptPassword(passwordJeff),
           admin : false
       }]
        nuevosUsuarios.forEach(usuario =>{
             Usuario.create(usuario);
        });

        res.status(201).json({message : "Usuarios cargados","Usuarios" : nuevosUsuarios});

 });



//Productos Iniciales Y Estados de Pedidos
router.post('/cargarProductos',security.autorizarUsuario ,async(req,res)=>{
       if(!req.admin) return res.status(400).json({message : "Acceso Denegado !!"});
       const productos = await Producto.findAll();
        if(productos.length>0) return res.json({message : "Ya se cargaron los Productos de Prueba"});
        const nuevosProductos = [{
             name : "Hamburguesa",
             description : "Hamburguesa doble carne con las mejores salsas de la casa",
             price : 12000,
             image : "https://c8.alamy.com/compes/x2054j/deliciosa-hamburguesa-doble-con-una-losa-de-queso-derretido-durante-dos-hamburguesas-de-carne-vacuna-en-un-crujiente-de-lechuga-sobre-un-panecillo-sesamo-cerrar-vista-lateral-de-un-contador-de-madera-rustica-x2054j.jpg",
             stock : true
        },{
            name : "Hot Dog",
            description : "Hot dog con una rica ensalada y las mejores salsas de la casa",
            price : 8000,
            image : "https://i.pinimg.com/originals/19/f8/d6/19f8d6a32c8cf5dc5621a2ce7acf7563.jpg",
            stock : true
        },{
            name : "Salchipapas",
            description : "Salchipapas con queso Mozarela y las mejores salsas de la casa",
            price : 7000,
            image : "https://i0.wp.com/lacocinalatina.club/wp-content/uploads/2020/10/Salchipapas-Colombianas.jpg?      fit=700%2C394&ssl=1",
            stock : true
        }]

         nuevosProductos.forEach(producto=>{
              Producto.create(producto);
         });

           const estados = [
               {id : 1, estados : "Nuevo"},
               {id : 2, estados : "Confirmado"},
               {id : 3 , estados : "Preparando"},
               {id : 4 , estados : "Enviado"},
               {id : 5 , estados : "Entregado"}
           ]

           estados.forEach(estado =>{
               Estados.create(estado);
           });

           res.status(200).json({message : "Productos y Estados Creados", "Productos" : nuevosProductos});
       
});




module.exports = router;