const { Router } = require('express');

const sendQueryEmail = require('../controllers/contact.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router.route('/contact').post(withErrorHandling(sendQueryEmail));

module.exports = router;
