const express = require('express');
const router = express.Router();

const rc_controller = require('../controllers/rc.controller');

router.post('/readOnly', rc_controller.set_read_only);

module.exports = router;