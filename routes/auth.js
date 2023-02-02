
const { Router} =  require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSingIn } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
],login )


router.post('/google',[
    check('id_token','ID Token es necesario').not().isEmpty(),
    validarCampos
],googleSingIn )


module.exports = router;