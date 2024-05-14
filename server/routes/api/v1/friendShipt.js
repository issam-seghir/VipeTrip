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
	.delete(removeFriend)
	.delete(deleteFriendRequest)
	.post(createFriendRequest)
	.patch(acceptFriendRequest);

module.exports = router;
