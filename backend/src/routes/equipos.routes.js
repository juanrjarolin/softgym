const {Router} = require('express');
const router = Router();

const {getEquipo, getEquipos, createEquipo, updateEquipo, deleteEquipo} = require('../controllers/equipos.controller');

router.get('/', getEquipos);
router.get('/:id', getEquipo);
router.post('/', createEquipo);
router.put('/:id', updateEquipo);
router.delete('/:id', deleteEquipo);

module.exports = router;