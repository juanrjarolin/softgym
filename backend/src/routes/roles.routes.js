//Requiriendo el método Router de express para crear rutas del servidor
const {Router} = require('express');
const router = Router();

//requiriendo controladores para crear los api rest de roles
const {getRols, getRol, createRol, updateRol, deleteRol} = require('../controllers/rols.controller');
const {verificarUsuario} = require('../controllers/users.controller');

//api rest roles usuario
router.get('/', verificarUsuario, getRols);
router.get('/:id', verificarUsuario, getRol);
router.post('/', verificarUsuario, createRol);
router.put('/:id', verificarUsuario, updateRol);
router.delete('/:id', verificarUsuario, deleteRol);

module.exports = router;