const {Router} = require('express');
const router = Router();

const {createPermiso, getPermisos, deletePermiso, getPermiso, editPermiso} = require('../controllers/permisos.controller');

router.get('/', getPermisos);
router.get('/:id', getPermiso);
router.post('/', createPermiso);
router.delete('/:id', deletePermiso);
router.put('/:id', editPermiso);

module.exports = router;