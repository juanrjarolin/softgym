const {Router} = require('express');
const router = Router();

const {getMantenimiento, getMantenimientos, createMantenimiento, updateMantenimiento, deleteMantenimiento, updateSumaCostos} = require('../controllers/mantenimientos.controller');

router.get('/', getMantenimientos);
router.get('/:id', getMantenimiento);
router.post('/', createMantenimiento);
router.put('/:id', updateMantenimiento);
router.delete('/:id', deleteMantenimiento);
router.put('/suma-costos/:id', updateSumaCostos);

module.exports = router;