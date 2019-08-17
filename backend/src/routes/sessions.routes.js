const {Router} = require('express');
const router = Router();

const {getSessions} = require('../controllers/sessions.controller');

router.get('/', getSessions);

module.exports = router;