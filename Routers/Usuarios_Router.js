const router = require('express').Router();
const Usuario = require('../Models/Usuarios');
const bcrypt = require('bcrypt');
const security = require('../Config/validar');
const jwt = require('jsonwebtoken');
const config = require('../Config/config');

// Crear Usuario
router.post('/', async(req,res)=>{
    const{username, fullname,email,phone,address, password,admin} = req.body;
    if(password.length<8) return res.status(400).json({message : "El Password debe tener por lo menos 8 caracteres"});
    console.log(email.includes('@'));
    if(!email.includes('@') || !email.endsWith('.com')) return res.status(400).json({message : "Su email debe tener un @ y terminar en .com"});
    if(typeof username != "string") return res.status(400).json({message : "Tu nombre debe ser una Cadena de Texto"});
    // if(typeof phone != "number") return res.status(400).json({message : "El telefono debe contener solo Numeros"});
    if(typeof admin != 'boolean') return res.status(400).json({message : "Debes Ingresar un dato valido!!"});
    const encryp_passw = await  security.encryptPassword(password);
    const user = {
        
        username,
        fullname,
        email,
        phone,
        address,
        password :  encryp_passw,
        admin
    }

     const usuario = await Usuario.findOne({
         where : {email : email}
     });

     if(usuario) return res.status(400).json({message : "Este Email ya esta en Uso!!"});

     const saveUsuario = await Usuario.create(user);
      if(saveUsuario) return res.status(201).json(user);
      res.status(400).json({message :"No se Pudo Guadar este Usuario"});

});

// Mostrar todos los Usuarios Registrados

router.get('/', security.autorizarUsuario, async(req,res)=>{
      
      if(req.admin){
        const usuarios = await Usuario.findAll({
            attributes :{
                exclude : ['createdAt','updatedAt']
            }
        });
        if(usuarios.length ==0) return res.status(200).json({message : "No se han Registrado Usuarios!!"});
        res.status(200).json(usuarios); 
      } 
       
       const usuario = await Usuario.findOne({
           where : {id : req.id},
           attributes :{
               exclude : ['createdAt','updatedAt']
           }
       });
        
        if(usuario) return res.status(200).json(usuario);
         res.status(400).json({message : 'Error'});
     
});

 // Mostrar Usuario por Id
 router.get('/:id', security.autorizarUsuario, async(req,res)=>{
      if(req.admin){
        const usuario = await Usuario.findOne({
            where : {id : req.params.id},
            attributes : {
                exclude :['createdAt','updatedAt']
            }
        });
        if(usuario) return res.status(200).json(usuario);
        res.status(400).json({message : "No hay  Usuario Registrado con ese ID"});
      }
      else {
          res.status(401).json({message : "Acceso Denegado"});
      }
 });


// Eliminar un Usuario por Id
router.delete('/:id', security.autorizarUsuario, async(req,res)=>{   
      if(req.admin || req.id == req.params.id){
        const BuscarUsuario = await Usuario.findOne({
            where : {id : req.params.id}
        });
         if(!BuscarUsuario) return  res.status(400).json({message : "No hay Usuario Registrado con ese ID"});
     
         const EliminarUsuario =  await Usuario.destroy({
             where : {id : req.params.id}
         });
     
         if(EliminarUsuario)  return res.status(200).json({message : 'Eliminado con Exito' });
         res.status(400).json({message : "No se Pudo Eliminar este Usuario"});
      }
       else {
           res.status(401).json({message : "Acceso Denegado"});
       }
    
});


router.put('/:id', security.autorizarUsuario, async(req,res)=>{
     if(req.admin || req.id == req.params.id){
        const{username, fullname,email,phone,address, password} = req.body;

        const buscarUsuario = await Usuario.findOne({
            where : {id : req.params.id}
        });
     
           if(!buscarUsuario) return res.status(400).json({message : "No se Encontro Usuario por ese ID"});
          
              //Verificar info del Body
           if(password.length<8) return res.status(400).json({message : "El Password debe tener por lo menos 8 caracteres"});
           console.log(email.includes('@'));
           if(!email.includes('@') || !email.endsWith('.com')) return res.status(400).json({message : "Su email debe tener un @ y terminar en .com"});
           if(typeof username != "string") return res.status(400).json({message : "Tu nombre debe ser una Cadena de Texto"});
            
            const encryp_passw = await security.encryptPassword(password);
     
           const usuarioModificado =  {
               username,
               fullname,
               email,
               phone,
               address,
               password : encryp_passw
           }
     
           const usuarioActualizado = await Usuario.update(usuarioModificado,{
               where : {id : req.params.id}
           });
            if(usuarioActualizado[0] !==0) return res.status(201).json({message : "Actualizado con Exito"});
            res.status(400).json({message : "No se Pudo Actualizar"});
     }
     else {
         res.status(401).json({message : "Acceso Denegado!!"});
     }
});

//Login Usuario

  router.post('/login',async(req,res)=>{
      const usuario = await Usuario.findOne({
          where : {email : req.body.email}
      });
       if(!usuario) return res.status(400).json({message : "No se encontro Usuario con este Email por favor Registrese!!"});
       const verificarPassword = await security.comparePassword(req.body.password,usuario.password);
        if(!verificarPassword) return res.status(401).json({message : "Contraseña No Coincide vuelva a Intentar!!"});
        
        const usuarioAut = {
            id : usuario.id,
            email : usuario.email,
            admin : usuario.admin
        }
        const token = jwt.sign(usuarioAut,config.TOKEN_SECRET);
        res.status(200).header('token',token).json(token);
  });








module.exports = router;