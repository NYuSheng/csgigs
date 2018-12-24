const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user.controller');

router.post('/create', user_controller.user_create);
router.post('/login', user_controller.user_login);
router.post('/usersByPrefix', user_controller.get_user_by_prefix);

module.exports = router;
