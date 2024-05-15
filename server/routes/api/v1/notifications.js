const express = require("express");

const router = express.Router({ mergeParams: true });
const {
	getNotifications,
	markAsRead,
	deleteNotification,
	deleteAllNotifications,
} = require("@controllers/notificationsController");

// router.route("/").get(getAllFriends);
router.route("/").get(getNotifications).delete(deleteAllNotifications);
router.route("/:notifId").put(markAsRead).delete(deleteNotification);

module.exports = router;
