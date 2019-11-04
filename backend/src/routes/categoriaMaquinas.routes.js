const {Router} = require('express');
const router = Router();
const {createCategoriaMaquina, getCategoriaMaquina, getCategoriaMaquinas, deleteCategoriaMaquina, updateCategoriaMaquina} = require('../controllers/maquinaCategoria.controller');

router.get('/', getCategoriaMaquinas);
router.get('/:id', getCategoriaMaquina);
router.post('/', createCategoriaMaquina);
router.put('/:id', updateCategoriaMaquina);
router.delete('/:id', deleteCategoriaMaquina);

module.exports = router;