const express = require('express');
const router = express.Router();

const task_controller = require('../controllers/task.controller');

router.post('/addTask',task_controller.create_tasks)
router.post('/getTasksByGigs/:gigname', task_controller.get_tasks_gigs);
router.post('/updateTask/:taskid', task_controller.update_task);
router.post('/removeTask/:taskid', task_controller.remove_task);
router.post('/updateTasksPoints', task_controller.update_points_allocation);

module.exports = router;
