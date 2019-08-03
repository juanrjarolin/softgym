const { Router } = require('express');
const router = Router();

const {getUsers, createUser, getUser, deleteUser, updateUser, login, verificarUsuario} = require('../controllers/users.controller');

//REST API ACCOUNT USERS
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/signup', createUser);
router.post('/signin', login);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);
router.get('/profile', verificarUsuario);
module.exports = router;