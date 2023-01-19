const {response} = require('express');



const indexUsuario = ( req, res=response)=> {
    const {hola} = req.query;

    res.json({
        msg:'Get Api - controlador',
        hola
    })
  }


 const createUsuarios = (req, res)=> {

    const {nombre,edad} = req.body;

    res.status(201).json({
        msg:'post Api - controlador',
        nombre,
        edad
    })
  }
  
  
  const updateUsuarios = (req, res)=> {

    const id = req.params.id;

    res.json({
        msg:'put Api - controlador',
        id
    })
  } 


  const destroyUsuarios = (req, res)=> {
    res.json({
        msg:'delete Api - controlador'
    })
  } 




 module.exports = {
    indexUsuario,
    createUsuarios,
    updateUsuarios,
    destroyUsuarios
 } 