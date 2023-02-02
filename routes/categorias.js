
const { Router} =  require('express');
const { check } = require('express-validator');
const { storeCategoria, indexCategorias, showCategoria, updateCategoria, detroyCategoria } = require('../controllers/categorias');
const { existeCategoriaId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//obtener todas la categorias --publico
router.get('/',indexCategorias);

//obtener la categoria por id --publico
router.get('/:id',[
    check('id','no es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],showCategoria);

//crear categoria -privado- cualquier persona con un toke valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],storeCategoria);

//Actualizar -privado- cualquier persona con un toke valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id','no es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],
updateCategoria);

//borrar una categoria -privado- Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','no es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],detroyCategoria);

module.exports = router;