const {Router} = require('express');
const router = Router();

const {getClass, getClases, createClass, deleteClass, updateClass} = require('../controllers/clases.controller');

//API REST CLASES
router.get('/', getClases);
router.get('/:id', getClass);
router.post('/', createClass);
router.delete('/:id', deleteClass);
router.put('/:id', updateClass);

module.exports= router;
