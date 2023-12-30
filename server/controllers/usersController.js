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


const getUserFriends = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("friends");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user.friends);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const addRemoveUserFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id);
		const friend = await User.findById(friendId);
		if (!user) return res.status(404).json({ message: "User not found" });
		if (!friend) return res.status(404).json({ message: "friend not found" });

		if (user.friends.includes(friendId)) {
			user.friends.pull(friendId);
			friend.friends.pull(id);
		}
		else{
			user.friends.push(friendId);
			friend.friends.push(id);
		}
		await user.save();
		await friend.save();

		const updatedUser = await user.populate("friends");
		res.json(updatedUser.friends);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};



module.exports = {
	getAllUsers,
	deleteUser,
	getUser,
	getUserFriends,
	addRemoveUserFriend,
};
