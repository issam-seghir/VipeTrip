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
	// Check if User A sent a friend request to User B or User B sent a friend request to User A
	// A --> B , B --> A realtionship
	const friendRequest = await FriendShip.findOne({
		$or: [
			{ userId: userId, friendId: friendId },
			{ userId: friendId, friendId: userId },
		],
	})
		.populate("friendId")
		.populate("userId");
	if (friendRequest) {
		// Determine if the current user is the sender or receiver of the friend request
		friendRequest.type = friendRequest.userId.id.toString() === userId ? "sender" : "receiver";
	}

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

	// Check if User A sent a friend request to User B or User B sent a friend request to User A
	// A --> B , B --> A realtionship
	const existingFriendship = await FriendShip.findOne({
		$or: [
			{ userId: userId, friendId: friendId },
			{ userId: friendId, friendId: userId },
		],
	});
	if (existingFriendship) {
		return res.status(400).json({ message: "Friend request already exists" });
	}

	const newFriendShip = new FriendShip({
		userId,
		friendId,
		status: "Requested",
	});
	await newFriendShip.save();

	const populatedNewFriendShip = await FriendShip.findOne({
		$or: [
			{ userId: userId, friendId: friendId, status: "Requested" },
			{ userId: friendId, friendId: userId, status: "Requested" },
		],
	})
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
		{ _id: requestId, status: "Requested" },
		{ status: "Accepted" },
		{ new: true } // This option returns the updated document
	);
	if (!friendship) {
		return res.status(404).json({ message: "Friend request not found" });
	}

	// Add friendId to user's friends array
	user.friends.push(friendship?.friendId);
	await user.save();

	// Find the friend and add userId to friend's friends array
	const friend = await User.findById(friendship?.friendId);
	if (friend) {
		friend.friends.push(userId);
		await friend.save();
	}

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

	res.status(200).json({ message: "Friend request Declined successfully" });
});

exports.removeFriend = asyncWrapper(async (req, res) => {
	const { friendId } = req.params;
	const userId = req?.user?.id;
	console.log(friendId, userId);
	const user = await User.findById(userId);
	const friend = await User.findById(friendId);
	if (!user) {
		return res.status(404).json({ message: `Requesting user not found` });
	}
	if (!friend) {
		return res.status(404).json({ message: `Friend user not found` });
	}

	// Check if User A is a friend of User B or User B is a friend of User A
	const friendship = await FriendShip.findOneAndDelete({
		$or: [
			{ userId: userId, friendId: friendId, status: "Accepted" },
			{ userId: friendId, friendId: userId, status: "Accepted" },
		],
	});
	if (!friendship) {
		return res.status(404).json({ message: "Friendship not found" });
	}

	// Remove friendId from user's friends array
	user.friends = user.friends.filter((id) => id.toString() !== friendId);
	await user.save();

	// Remove userId from friend's friends array
	friend.friends = friend.friends.filter((id) => id.toString() !== userId);
	await friend.save();

	res.status(200).json({ message: "Friend removed successfully" });
});
