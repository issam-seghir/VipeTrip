const express = require("express");

const router = express.Router();
const { getAllFriends, getAllFriendRequests, createFriendRequest, acceptFriendRequest, removeFriend } = require("@controllers/friendShipController");

router.route("/").get(getAllFriends);
router.route("/:friendId").delete(removeFriend);

// Routes related to friend requests
router.route("/friend-requests").get(getAllFriendRequests).post(createFriendRequest);
router.route("/friend-requests/:requestId").patch(acceptFriendRequest);

module.exports = router;
