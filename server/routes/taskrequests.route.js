const express = require('express');
const router = express.Router();

const task_requests_controller = require('../controllers/taskrequests.controller');

router.get('/:task_id',task_requests_controller.get_requests_by_id);
router.post('/create', task_requests_controller.create_task_request);
router.post('/update_task_request', task_requests_controller.update_request_status);

module.exports = router;
