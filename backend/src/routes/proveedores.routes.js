const {Router} = require('express');
const router = Router();

const {getProveedor, getProveedores, createProveedor, updateProveedor, deleteProveedor} = require('../controllers/proveedores.controller');

router.get('/', getProveedores);
router.get('/:id', getProveedor);
router.post('/', createProveedor);
router.put('/:id', updateProveedor);
router.delete('/:id', deleteProveedor);

module.exports = router;