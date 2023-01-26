const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');

const validarJWT = async(req,res,next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'no hay token en la peticion'
        })
    }


    try {
        
       const {uid}= jwt.verify(token,process.env.SECREORPRIVATEKEY)

      
       //retornar usuario con el uid
       const usuario = await Usuario.findById(uid);

        req.usuario = usuario;

        if(!usuario){
            return res.status(401).json({
                msg:'TOken no valido - usuario no existe en base de datos '
            })
        }

        //verificar si el uid tiene estado true

        if(!usuario.estado){
            return res.status(401).json({
                msg:'TOken no valido - usuario con estado false '
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }
}


module.exports ={
    validarJWT
}