const express = require("express");

const router = express.Router({ mergeParams: true });
const { getNotifications,markAsRead } = require("@controllers/notificationsController");

// router.route("/").get(getAllFriends);
router.route("/").get(getNotifications);
router.route("/:notifId").put(markAsRead);

module.exports = router;
