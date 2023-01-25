const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const indexUsuario = async ( req, res=response)=> {
    const {limite= 5,desde = 0} = req.query;
  const query = {estado:true}


/* Ejecutar dos promesas al mismo tiempo */
  const [total,usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
            .skip(desde)
            .limit(Number(limite))
  ])

    res.json({
      total,
      usuarios,
    })
  }


 const createUsuarios = async(req, res)=> {

  

    const {nombre ,correo,password,rol} = req.body;
    const usuario = new Usuario({nombre ,correo,password,rol});

    //verificar si el correo ya existe
  

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
     usuario.password = bcryptjs.hashSync(password,salt);
    //guardar en BD
    await usuario.save();
    
    res.status(201).json({
        usuario
    })
  }
  
  
  const updateUsuarios = async (req, res)=> {

    const {id} = req.params;
    const {_id,password,google,correo,...resto} = req.body;

    //validar todo en contra de base de datos

    if(password){
      //encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password,salt);
    }


    const usuario = await Usuario.findByIdAndUpdate(id,resto);


    res.json(usuario)
  } 


  const destroyUsuarios = async (req, res)=> {
     const {id} = req.params;

    //fisicamente lo borramos
/*     const usuario =  await Usuario.findByIdAndDelete(id);
 */

      //Eliminar cambiando solo el estado del usuario

      const usuario = await Usuario.findByIdAndUpdate(id,{estado:false})


    res.json({
      usuario
    })
  } 




 module.exports = {
    indexUsuario,
    createUsuarios,
    updateUsuarios,
    destroyUsuarios
 } 