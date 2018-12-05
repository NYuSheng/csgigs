const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', user_controller.test);
router.post('/create', user_controller.user_create);
router.post('/login', user_controller.user_login);
router.post('/login2', user_controller.user_login2);
router.post('/usersByPrefix', user_controller.get_user_by_prefix);
// router.post('/searchByPrefix', user_controller.searchByPrefix)
module.exports = router;
