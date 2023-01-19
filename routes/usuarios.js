const { Router} =  require('express');
const { indexUsuario, createUsuarios, updateUsuarios, destroyUsuarios } = require('../controllers/usuarios');

const router = Router();


router.get('/',indexUsuario )

  router.post('/', createUsuarios )

  router.put('/:id',updateUsuarios)

  router.delete('/',destroyUsuarios)



module.exports = router;