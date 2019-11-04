const {Router} = require('express');
const router = Router();

const {getPersona, getPersonas, createPersona, updatePersona, deletePersona} = require('../controllers/personas.controllers');

//API REST PERSONAS
router.get('/:tipo', getPersonas);
router.get('/:id', getPersona);
router.post('/', createPersona);
router.delete('/:id', deletePersona);
router.put('/:id', updatePersona);

module.exports= router;