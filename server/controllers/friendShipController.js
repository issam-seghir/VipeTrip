const FriendShip = require("@model/FriendShip");
const User = require("@model/User");


const createFriendRequest = async (req, res) => {
	try {
		const { userId, friendId } = req.params;
		const user = await User.findById(userId);
		const friend = await User.findById(friendId);
		if (!user || !friend) {
			return res.status(204).json({ message: `User not found` });
		}

		// Create a new post
		const newFriendShip = new FriendShip({
			userId,
			friendId,
			status: "Requested",
		});
		await newFriendShip.save();

		res.status(201).json(newFriendShip);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const acceptFriendRequest = async (req, res) => {
	try {
		const { userId, friendId } = req.params;
		const friendship = await FriendShip.findOne({ userId, friendId, status: "Requested" });
		if (!friendship) {
			return res.status(404).json({ message: "Friend request not found" });
		}

		friendship.status = "Accepted";
		await friendship.save();

		res.json(friendship);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.params;
        const friendship = await FriendShip.findOne({ userId, friendId, status: 'Accepted' });
        if (!friendship) {
            return res.status(404).json({ message: 'Friendship not found' });
        }

        await friendship.remove();

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params;
        const friendships = await FriendShip.find({ userId, status: 'Accepted' }).populate('friendId');
        const friends = friendships.map(friendship => friendship.friendId);

        res.json(friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFriendRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const friendships = await FriendShip.find({ friendId: userId, status: 'Requested' }).populate('userId');
        const friendRequests = friendships.map(friendship => friendship.userId);

        res.json(friendRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
	createFriendRequest,
	acceptFriendRequest,
	removeFriend,
	getAllFriends,
	getAllFriendRequests,
};
