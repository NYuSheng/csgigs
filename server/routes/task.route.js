const express = require('express');
const router = express.Router();

const task_controller = require('../controllers/task.controller');

router.post('/addTask',task_controller.create_tasks)
router.get('/getTasksByGig/:gig_id', task_controller.get_tasks_gigs);
router.put('/:task_id', task_controller.update_task);
router.post('/removeTask/:task_id', task_controller.remove_task);

module.exports = router;
