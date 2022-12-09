const { Router } = require('express');
const sendQueryEmail = require('../controllers/contact.controller');
const { methodNotAllowed } = require('../middlewares/index');
const router = Router();

router.route('/').post(sendQueryEmail).all(methodNotAllowed);

module.exports = router;
