//importando el método router para las rutas del servidor
const { Router } = require('express');
const router = Router();

const {getUsers, createUser, getUser, deleteUser, updateUser, login, verificarUsuario, updatePassword, recuperacionPassword} = require('../controllers/users.controller');

//rest api account users and security
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/signup', createUser);
router.post('/signin', login);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);
router.put('/changepassword/:id', updatePassword);
router.get('/profile', verificarUsuario);
router.post('/recuperacion', recuperacionPassword);

module.exports = router;