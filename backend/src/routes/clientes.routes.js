const {Router} = require('express');
const router = Router();

const {createCliente,getCliente,getClientes,updateCliente, deleteCliente} = require('../controllers/cliente.controller');

router.get('/', getClientes);
router.get('/:id', getCliente);
router.post('/', createCliente);
router.put('/:id',updateCliente);
router.delete('/:id', deleteCliente);

module.exports= router;






