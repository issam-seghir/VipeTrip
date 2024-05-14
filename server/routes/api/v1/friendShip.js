const express = require("express");

const router = express.Router({ mergeParams: true });
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
	.delete(removeFriend);

router.route("/friends-request/:requestId").patch(acceptFriendRequest).delete(deleteFriendRequest);
module.exports = router;
