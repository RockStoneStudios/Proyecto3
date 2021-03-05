const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../Models/Usuarios');
const config = require('./config');

const encryptPassword =  async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password,salt);
    return hasedPassword;
}

const comparePassword = async(password,passwordSave) =>{
     try {
        const compare = await bcrypt.compare(password,passwordSave);
        return compare;
     } catch(error){
         console.log(error);
     }
}
 
    
   
const autorizarUsuario = async(req,res,next)=>{
       const token = req.header('token');
        if(!token) return res.status(400).json({message : "!Acesso Denegado!  Logueate"});
     try {
        const usuarioAutenticado = await jwt.verify(token,config.TOKEN_SECRET);
         
         if(usuarioAutenticado) {
             [req.admin,req.email,req.id] = [usuarioAutenticado.admin,usuarioAutenticado.email,usuarioAutenticado.id];
             next();
            }
            else {
                throw "Sin Acceso"
            }
       
        
    } catch{
        res.status(400).json({message : "Token Invalido"});
    }
    }

module.exports = {
    encryptPassword,
    comparePassword,
    // validarUsuario,
    autorizarUsuario
}