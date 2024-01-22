const express = require("express");

const router = express.Router();
const { getAllUsers, deleteUser, getUser} = require("@controllers/usersController");
const { getAllFriends, getAllFriendRequests, createFriendRequest, acceptFriendRequest, removeFriend } = require("@controllers/friendShipController");
const { getUserPosts } = require("@controllers/postsController");

router.route("/").get(getAllUsers);
router.route("/:userId").get(getUser).delete(deleteUser);

router.route("/:userId/posts").get(getUserPosts);

router.route("/:userId/friends").get(getAllFriends);
router.route("/:userId/friends/:friendId").delete(removeFriend);

router.route("/:userId/requests").get(getAllFriendRequests);
router.route("/:userId/requests/:requestId").post(createFriendRequest);

router.route("/:userId/accept/:requestId").patch(acceptFriendRequest);

module.exports = router;
