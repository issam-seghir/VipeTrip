const express = require("express");

const router = express.Router();
const { getAllUsers, deleteUser, getUser } = require("@controllers/usersController");

// Read
router.route("/").get(getAllUsers).delete(deleteUser);

router.route("/:id").get(getUserId);
router.route("/:id/friends").get(getAllUserFriends);

// Update
router.route("/:id/:friendId").patch(getUserFriendId);

module.exports = router;
