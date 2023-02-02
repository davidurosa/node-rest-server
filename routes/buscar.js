const { Router} =  require('express');
const { buscar } = require('../controllers/buscar');
const { modelName } = require('../models/categoria');


const router = Router();

router.get('/:coleccion/:termino',buscar);


module.exports = router;