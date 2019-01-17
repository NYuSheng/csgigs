const express = require("express");
const router = express.Router();

const rc_controller = require("../controllers/rc.controller");

router.post("/set_read_only_channel", rc_controller.set_read_only_channel);
router.post("/set_group_type", rc_controller.set_group_type);
router.post("/publish_message", rc_controller.publish_message);
router.post(
  "/publish-replyable-message",
  rc_controller.publishMessageWithReplyOptions
);
router.post("/kick_user", rc_controller.kick_user);
router.post("/remove_owner_from_group", rc_controller.remove_owner_from_group);

module.exports = router;
