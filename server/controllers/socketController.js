const FriendShip = require("@model/FriendShip");
const Post = require("@model/Post");
const User = require("@model/User");
const Like = require("@model/Like");
const Comment = require("@model/Comment");
const mongoose = require("mongoose");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");
const fs = require("node:fs");
const path = require("node:path");



// Function to get user's friends from the database
const getUserFriends = async (userId) => {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Find the user's friends
    const friends = await FriendShip.find({
		userId,
		status: "Accepted",
	});
    return friends.map(friend => friend.id); // Return only the IDs
};

module.exports = {getUserFriends};
