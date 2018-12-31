const express = require("express");
const router = express.Router();

const task_request_controller = require("../controllers/taskrequest.controller");

router.get("/:task_id", task_request_controller.get_requests_by_id);
router.put("/:task_request_id", task_request_controller.update_request_status);
router.post("/create", task_request_controller.create_task_request);

module.exports = router;
