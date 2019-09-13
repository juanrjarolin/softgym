const {Router} = require('express');
const router = Router();

const {getSucursal, getSucursales, createSucursal, updateSucursal, deleteSucursal} = require('../controllers/sucursales.controller');

router.get('/', getSucursales);
router.get('/:id', getSucursal);
router.post('/', createSucursal);
router.put('/:id', updateSucursal);
router.delete('/:id', deleteSucursal);

module.exports = router;