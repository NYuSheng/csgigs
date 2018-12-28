const express = require("express");
const router = express.Router();

const rc_controller = require("../controllers/rc.controller");

router.post("/set_read_only_channel", rc_controller.set_read_only_channel);
router.post("/set_group_type", rc_controller.set_group_type);
router.post("/publish_message", rc_controller.publish_message);

module.exports = router;
