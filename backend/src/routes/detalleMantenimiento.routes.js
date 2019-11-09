const {Router} = require('express');
const router = Router();

const {createDetalle, getDetalles, getDetalle, deleteDetalle, updateDetalle, allDetalles} = require('../controllers/detalleMantenimiento.controller');

//router.get('/', allDetalles);
router.get('/:id', getDetalles);
router.post('/', createDetalle);
router.get('/detail/:id', getDetalle);
router.delete('/:id', deleteDetalle);
router.put('/:id', updateDetalle);

module.exports = router;