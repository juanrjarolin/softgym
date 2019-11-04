const {Router} = require('express');
router = Router();

const {getVenta, getVentas, createVenta, updateVenta, deleteVenta} = require('../controllers/ventas.controller');

//api rest ventas
router.get('/', getVentas);
router.get('/:id', getVenta);
router.post('/', createVenta);
router.put('/:id', updateVenta);
router.delete('/:id', deleteVenta);

module.exports = router;