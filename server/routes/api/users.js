const express = require("express");

const router = express.Router();
const { getAllUsers, deleteUser, getUser, getUserFriends, addRemoveUserFriend } = require("@controllers/usersController");

// Read
router.route("/").get(getAllUsers).delete(deleteUser);

router.route("/:id").get(getUser);
router.route("/:id/friends").get(getUserFriends);

// Update
router.route("/:id/friends/:friendId").patch(addRemoveUserFriend);

module.exports = router;
