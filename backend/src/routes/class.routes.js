const {Router} = require('express');
const router = Router();

const {getClase, getClases, createClase, deleteClase, updateClase} = require('../controllers/clases.controller');

//API REST CLASES
router.get('/', getClases);
router.get('/:id', getClase);
router.post('/', createClase);
router.delete('/:id', deleteClase);
router.put('/:id', updateClase);

module.exports= router;
