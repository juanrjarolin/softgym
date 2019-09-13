const {Router} = require('express');
const router = Router();

const {getReserva, getReservas, createReserva, updateReserva, deleteReserva} = require('../controllers/reservas.controller');

router.get('/', getReservas);
router.get('/:id', getReserva);
router.post('/', createReserva);
router.put('/:id', updateReserva);
router.delete('/:id', deleteReserva);

module.exports = router;