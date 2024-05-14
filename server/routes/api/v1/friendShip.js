const express = require("express");

const router = express.Router({mergeParams: true});
const {
    getFriendRequest,
	createFriendRequest,
	acceptFriendRequest,
	deleteFriendRequest,
	removeFriend,
} = require("@controllers/friendShipController");

// router.route("/").get(getAllFriends);
router
	.route("/:friendId")
	.get(getFriendRequest)
	.post(createFriendRequest)
	.patch(acceptFriendRequest)
	.delete(deleteFriendRequest)
	.delete(removeFriend);

module.exports = router;
