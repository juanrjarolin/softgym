//Requiriendo el método Router de express para crear rutas del servidor
const {Router} = require('express');
const router = Router();

//requiriendo controladores para crear los api rest de roles
const {getRols, getRol, createRol, updateRol, deleteRol} = require('../controllers/rols.controller');
const {verificarUsuario} = require('../controllers/users.controller');

//api rest roles usuario
router.get('/', getRols);
router.get('/:id', getRol);
router.post('/', createRol);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

module.exports = router;