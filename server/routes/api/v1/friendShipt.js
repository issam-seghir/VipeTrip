const express = require("express");

const router = express.Router();
const {
	createFriendRequest,
	acceptFriendRequest,
	deleteFriendRequest,
	removeFriend,
} = require("@controllers/friendShipController");

// router.route("/").get(getAllFriends);
router
	.route("/:friendId")
	.post(createFriendRequest)
	.patch(acceptFriendRequest)
	.delete(deleteFriendRequest)
	.delete(removeFriend)

module.exports = router;
