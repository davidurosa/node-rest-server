
const { Router} =  require('express');
const { check } = require('express-validator');
const { storeProducto, indexProductos, showProducto, updateProducto, detroyProducto } = require('../controllers/Productos');
const { existeProductoId, existeCategoriaId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//obtener todas la Productos --publico
router.get('/',indexProductos);

//obtener la Producto por id --publico
router.get('/:id',[
    check('id','no es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
],showProducto);

//crear Producto -privado- cualquier persona con un toke valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','no es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
],storeProducto);

//Actualizar -privado- cualquier persona con un toke valido
router.put('/:id',[
    validarJWT,
    check('categoria','no es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
],
updateProducto);

//borrar una Producto -privado- Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','no es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
],detroyProducto);

module.exports = router;