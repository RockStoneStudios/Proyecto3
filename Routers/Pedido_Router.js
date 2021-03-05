const router = require('express').Router();
const Pedidos = require('../Models/Pedidos');
const security = require('../Config/validar');
const Tabla_Pedidos = require('../Models/Tabla_Pedidos');
const Producto = require('../Models/Productos');
const Usuario = require('../Models/Usuarios');
const Estados = require('../Models/Estados');


// Creacion de Estados 



//Tomar Pedido
router.post('/',security.autorizarUsuario,async(req,res)=>{
   const {ProductoId,cantidad,metodo_pago} = req.body;
    
     
    if(!ProductoId) return res.status(400).json({message : "Ingrese id del Producto a pedir!!"});

    if(!cantidad) return res.status(400).json({message : "Ingrese una cantidad de producto a pedir!!"});

    if(!metodo_pago) return res.status(400).json({message : "Ingrese un metodo de pago valido!!"});
    let total_pedido = 0;
    let total_a_pagar = 0;
    
    for(let i = 0; i<ProductoId.length;i++){
        let producto = ProductoId[i];
        
        let productoDisponible = await Producto.findOne({
            where : {id : producto}
        });
        if(!productoDisponible) return res.status(400).json({message : "Este Producto no Existe"});
         if(!productoDisponible.stock) return res.status(401).json({message : "Producto no disponible"});
        
         
         total_pedido+= productoDisponible.price*cantidad[i];
        //  total_a_pagar += productoDisponible.price*cantidad[i];
         
         let detalle_pedido = {
             nombre_producto : productoDisponible.name,
             cantidad_producto : cantidad[i],
             precio_total : total_pedido

         } 
              
          let detalle = await Tabla_Pedidos.create(detalle_pedido);  
          console.log("entro al detalle"+detalle);  
        
           
    }
    
    let nuevo_pedido = {
        metodo_pago ,
        total_pedido ,
        // ProductoId : productoDisponible.id,
        UsuarioId : req.id,
        EstadoId: 1
    }
     
     if(nuevo_pedido) {
       let pedido = await Pedidos.create(nuevo_pedido);
       await Tabla_Pedidos.update({PedidoId : pedido.id},{
           where : {PedidoId : null}
       });

       let estado = await Estados.findOne({
           where : {id : pedido.EstadoId}
       });
       console.log(pedido.total_pedido);

       return res.status(200).json({
           Mensaje:`El pedido de se ha creado con exito.`,
           "Numero de pedido": pedido.id,
           "A pagar": `$${pedido.total_pedido}`,
           "Forma de pago": metodo_pago,
           "Estado del pedido " : estado.estados} );
     }
     else return res.status(400).json({error: "Ha ocurrido un error..."}) ;
     res.status(201).json({message : "Pedido Creado con Exito"});
   
  
   
   
});

// Obtener todos los pedidos 

router.get('/',security.autorizarUsuario,async(req,res)=>{
   if(req.admin) {
    const pedidos = await Pedidos.findAll();
    if(pedidos.length==0) return res.status(200).json({message : "No hay Pedidos"});
    let array_pedidos = [];
    for(let i =0;i<pedidos.length;i++){
        let array_detalles = [];
        let detalles = await Tabla_Pedidos.findAll({
            where : {PedidoId : (i+1)}
        });
        const usuario = await Usuario.findOne({
            where : {id : pedidos[i].UsuarioId}
        });
        detalles.forEach(element =>{
            array_detalles.push(element.nombre_producto);
            array_detalles.push(element.cantidad_producto);
        });
        
        let arreglo_pedidos = {
             "Usuario" : usuario.id,
             "Numero Pedido" : pedidos[i].id,
             "Valor Pedidos" : pedidos[i].total_pedido,
             "Detalles" : array_detalles.join(" ")
        }
        array_pedidos.push(arreglo_pedidos);
        console.log(array_pedidos);
    }
   return  res.status(200).json(array_pedidos);
   }
   
   const pedido = await Pedidos.findAll({
       where : {UsuarioId : req.id},
       attributes : {
           exclude : ['createdAt','updatedAt','status','EstadoId','UsuarioId']
       },
       include : [ {
           model : Tabla_Pedidos,
           attributes : {
               exclude : ['id','precio_total','createdAt','updatedAt','PedidoId']
           }
       },
          { model : Estados,
              attributes : {
                  exclude : ['createdAt','updatedAt','id']
             }
          }
       ]
   
   });
    if(pedido==0) return res.status(200).json({message : "No hay Pedidos"});
   

     
      res.status(200).json(pedido);

    
});

router.get('/:id',security.autorizarUsuario,async(req,res)=>{
       const detallePedidoUsuario = [];
      
      if(req.admin || req.id == req.params.id) {
        const pedido = await Pedidos.findAll({
            where : {UsuarioId : req.params.id},
            attributes : {
                exclude : ['createdAt' ,'updatedAt','EstadoId',]
            },
            include : {
                model : Estados,
                attributes : ['estados']
            }
        });

        
        
         if(pedido.length>0) return res.status(200).json(pedido);
         res.status(400).json({message : "Este Usuario no ha hecho ningun Pedido!!"});
      }
   
    res.status(401).json({message : "Acceso Denegado"});

});

// Delete Pedidos 

router.delete('/:id',security.autorizarUsuario,async(req,res)=>{
      if(!req.admin) return res.status(401).json({message : "Acceso Denegado"});
      const eliminarPedido = await Pedidos.destroy({
        where : {id : req.params.id}
    });
      if(eliminarPedido !=0) return res.status(200).json({message : `Pedido Numero ${req.params.id} Borrado con Exito`});
      res.status(400).json({message : "No seencontro Usuario por Id"})
});

// Actualizar Estados

router.put('/:id',security.autorizarUsuario,async(req,res)=>{
       if(!req.admin) return res.status(401).json({message : "Acceso Denegado"});
       const consulta = await Pedidos.findOne({
           where : {id : req.params.id}
       });
       if(consulta.EstadoId == 5) return res.status(200).json({message : "Este Pedido ya fue entregado"});

       const pedido = await Pedidos.update({EstadoId : (consulta.EstadoId+1)},{
           where : {id : req.params.id}
       });

       const preconsulta = await Estados.findOne({
           where : {id : consulta.EstadoId}
       });

       const postconsulta = await Estados.findOne({
           where : {id : (consulta.EstadoId+1)}
       });

       if(pedido[0]) return res.status(200).json({message : `El Pedido # ${req.params.id} paso de ${preconsulta.estados} a ${postconsulta.estados}` });
       res.status(400).json({message : "No se Encontro Id"});


})












module.exports = router;