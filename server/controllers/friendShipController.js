const FriendShip = require("@model/FriendShip");
const User = require("@model/User");
const { asyncWrapper } = require("@middleware/asyncWrapper");

exports.getFriendRequest = asyncWrapper(async (req, res) => {
	const userId = req?.user?.id;
	const { friendId } = req.params;
	const user = await User.findById(userId);
	const friend = await User.findById(friendId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	if (!friend) {
		return res.status(404).json({ message: `Friend user not found` });
	}
	const friendRequest = await FriendShip.findOne({ userId, friendId, status: "Requested" })
		.populate("friendId")
		.populate("userId");
	res.status(200).json({ message: "Get Friend request successfully", data: friendRequest });
});

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

	const populatedNewFriendShip = await FriendShip.findOne({ userId, friendId, status: "Requested" })
		.populate("friendId")
		.populate("userId");

	res.status(201).json({ message: "Friend request sent successfully", data: populatedNewFriendShip });
});

exports.acceptFriendRequest = asyncWrapper(async (req, res) => {
	const { requestId } = req.params;
	const userId = req?.user?.id;

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}

	const friendship = await FriendShip.findOneAndUpdate(
		{ id: requestId, status: "Requested" },
		{ status: "Accepted" },
		{ new: true } // This option returns the updated document
	);
	if (!friendship) {
		return res.status(404).json({ message: "Friend request not found" });
	}

	user.friends.push(friendship?.friendId);

	res.status(200).json({ message: "Friend request Accepted successfully", data: friendship });
});

exports.deleteFriendRequest = asyncWrapper(async (req, res) => {
	const { requestId } = req.params;
	const userId = req?.user?.id;
	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}

	const friendship = await FriendShip.findOneAndDelete({ _id: requestId, status: "Requested" });
	if (!friendship) {
		return res.status(404).json({ message: "Friend request to Delete not found" });
	}

	res.status(200).json({ message: "Friend request Declined successfully", data: friendship });
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
