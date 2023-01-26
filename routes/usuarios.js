const { Router} =  require('express');
const { check } = require('express-validator');

const { indexUsuario, createUsuarios, updateUsuarios, destroyUsuarios } = require('../controllers/usuarios');
const { esRolValido, emailExiste, exiteUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();


router.get('/',indexUsuario )

  router.post('/', [
    //no tiene que tener un valor el nombre not() isEMpty()
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','EL password  debe tener mas de 6 letras').isLength({min:6}),
    /// QUe exista en un listado isIN
    check('correo').custom(emailExiste),

    check('rol').custom(esRolValido),


    
    check('correo','El correo no es valido').isEmail(),
    validarCampos
  ]
  , createUsuarios )

  router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(exiteUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
  ],updateUsuarios)

  router.delete('/:id',[
    validarJWT,
   //  esAdminRole,
   tieneRole('ADMIN_ROLE','VENTA_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(exiteUsuarioPorId),
    validarCampos
  ],destroyUsuarios)



module.exports = router;