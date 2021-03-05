const router = require('express').Router();
const security = require('../Config/validar');
const Producto = require('../Models/Productos');

// Crear Producto 

router.post('/register',security.autorizarUsuario, async(req,res)=>{
    if(req.admin){
        const {name,description,price,image,stock} = req.body;
        if(name.length<=0) return res.status(400).json({message : "Debe Ingresar un nombre para el producto!!"});
        if(description.length<=0) res.status(400).json({message : "El producto debe tener una descripcion"});
        if(typeof price != "number") res.status(400).json({message : "El precio debe ser un Valor Numerico"});
        const producto = {
            name,
            description,
            price,
            image,
            stock
        }
    
        const crearProducto = await Producto.create(producto);
          if(crearProducto) return res.status(201).json(producto);
          res.status(400).json({message : "No se pudo guardar producto"});
    }
    res.status(400).json({message : "No eres el administrador"});
})


  // Mostrar Productos 

  router.get('/',security.autorizarUsuario,async(req,res)=>{
   
        const productos = await Producto.findAll({
            attributes :{
                exclude : ['createdAt','updatedAt']
            }
        });
        if(productos.length==0) return res.status(200).json({message : "No hay Productos registrados"});
        res.status(200).json(productos);
      
  });

   router.get('/:id',async(req,res)=>{
         const producto = await Producto.findOne({
             where : {id : req.params.id},
             attributes : {
                 exclude : ['createdAt','updatedAt']
             }
         });

         if(producto) return res.status(200).json(producto);
         res.status(400).json({message : "No se Pudo encontrar Producto por este Id"});
   });

   //Eliminar Producto

  router.delete('/:id',security.autorizarUsuario,async(req,res)=>{
        if(req.admin){
            const productoEliminar = await Producto.destroy({
                where : {id : req.params.id}
            });
                
             if(productoEliminar) return res.status(200).json({message : "Eliminado con Exito"});
             res.status(400).json({message : "No se encontro Producto con este id"});
        }
        res.status(401).json({message : "Accesso Denegado"});

  });

  // Actualizar Producto

 router.put('/:id',security.autorizarUsuario,async(req,res)=>{
       console.log(req.admin);
      if(req.admin){
        const {name,description,price,image,stock} = req.body;
        if(name.length<=0) return res.status(400).json({message : "Debe Ingresar un nombre para el producto!!"});
        if(description.length<=0) res.status(400).json({message : "El producto debe tener una descripcion"});
        if(typeof price != "number") res.status(400).json({message : "El precio debe ser un Valor Numerico"});
        const producto = {
            name,
            description,
            price,
            image,
            stock
        }
         const actualizarProducto = await Producto.update(producto,{
             where : {id : req.params.id}
         });
         if(actualizarProducto[0] !==0) return res.status(200).json({message : "Actualizado con Exito"});
         res.status(400).json({message : "No se Pudo Actualizar Producto"});
      }
      res.status(400).json({message : "Accesso Denegado"});
 });

 // Agregar un Producto a mis Favoritos


module.exports = router;