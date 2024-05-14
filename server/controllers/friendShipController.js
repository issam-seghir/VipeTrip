const FriendShip = require("@model/FriendShip");
const User = require("@model/User");
const { asyncWrapper } = require("@middleware/asyncWrapper");

exports.createFriendRequest = asyncWrapper(async (req, res) => {
	const { friendId } = req.params;
	const userId = req?.user?.id;

	const user = await User.findById(userId);
	const friend = await User.findById(friendId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	if (!friend) {
		return res.status(404).json({ message: `Friend user not found` });
	}

	const existingFriendship = await FriendShip.findOne({ userId, friendId });
	if (existingFriendship) {
		return res.status(400).json({ message: "Friend request already exists" });
	}

	const newFriendShip = new FriendShip({
		userId,
		friendId,
		status: "Requested",
	});
	await newFriendShip.save();

	res.status(201).json({ message: "Friend request sent successfully", data: newFriendShip });
});

exports.acceptFriendRequest = asyncWrapper(async (req, res) => {
	const { friendId } = req.params;
	const userId = req?.user?.id;

	const user = await User.findById(userId);
	const friend = await User.findById(friendId);

	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	if (!friend) {
		return res.status(404).json({ message: `Friend user not found` });
	}

	const friendship = await FriendShip.findOneAndUpdate(
		{ userId, friendId, status: "Requested" },
		{ status: "Accepted" },
		{ new: true } // This option returns the updated document
	);
	if (!friendship) {
		return res.status(404).json({ message: "Friend request not found" });
	}

	user.friends.push(friendId);

	res.status(200).json({ message: "Friend request Accepted successfully", data: friendship });
});

exports.deleteFriendRequest = asyncWrapper(async (req, res) => {
	const { friendId } = req.params;
	const userId = req?.user?.id;

	const user = await User.findById(userId);
	const friend = await User.findById(friendId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	if (!friend) {
		return res.status(404).json({ message: `Friend user not found` });
	}

	const friendship = await FriendShip.findOneAndDelete({ userId, friendId, status: "Requested" });
	if (!friendship) {
		return res.status(404).json({ message: "Friend Deleted not found" });
	}

	res.status(200).json({ message: "Friend request Declined successfully" });
});

exports.removeFriend = asyncWrapper(async (req, res) => {
	const { friendId } = req.params;
	const userId = req?.user?.id;

	const user = await User.findById(userId);
	const friend = await User.findById(friendId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	if (!friend) {
		return res.status(404).json({ message: `Friend user not found` });
	}

	const friendship = await FriendShip.findOneAndDelete({ userId, friendId, status: "Accepted" });
	if (!friendship) {
		return res.status(404).json({ message: "Friendship not found" });
	}

	// Remove friendId from user's friends array
	user.friends = user.friends.filter((id) => id.toString() !== friendId);
	await user.save();

	res.status(200).json({ message: "Friend removed successfully" });
});
