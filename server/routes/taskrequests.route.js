const express = require('express');
const router = express.Router();

const task_requests_controller = require('../controllers/taskrequests.controller');

router.get('/:task_id',task_requests_controller.get_requests_by_id);

module.exports = router;
