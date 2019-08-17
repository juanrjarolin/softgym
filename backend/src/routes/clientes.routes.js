const {Router} = require('express');
const router = Router();

const {createCliente,getCliente,getClientes,updateCliente} = require('../controllers/cliente.controller');

router.get('/', getClientes);
router.get('/:id', getCliente);
router.post('/', createCliente);
router.put('/:id',updateCliente);

module.exports= router;






