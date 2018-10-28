const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const task_controller = require('../controllers/task.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/addTasks',task_controller.create_tasks)
router.post('/getTasksByGigs/:gigname', task_controller.get_tasks_gigs);
module.exports = router;
