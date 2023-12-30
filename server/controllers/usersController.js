const User = require('@model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}


// const getUserFriendId = async (req, res) => {
// 	try {
// 		const user = await User.findById(req.params.id);
// 		const friend = await User.findById(req.params.friendId);

// 		if (!user) return res.status(404).json({ message: "User not found" });
// 		if (!friend) return res.status(404).json({ message: "Friend not found" });

// 		// Check if friend is already added
// 		if (user.friends.includes(friend._id)) {
// 			return res.status(400).json({ message: "Friend already added" });
// 		}

// 		user.friends.push(friend._id);
// 		await user.save();

// 		res.json(user.friends);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

const getUserFriends = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("friends");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user.friends);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};



module.exports = {
	getAllUsers,
	deleteUser,
	getUser,
	getUserFriends,
};
