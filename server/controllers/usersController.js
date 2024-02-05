const User = require("@model/User");
const asyncWrapper = require("@middleware/asyncWrapper");

const getAllUsers = asyncWrapper(async (req, res) => {
	// throw new Error("Test error"); // This line is for testing asyncWrapper only
	const users = await User.find();
	if (!users) return res.status(204).json({ message: "No users found" });
	res.json(users);
});

// const getAllUsers = asyncWrapper(async (req, res, next) => {
// 	// Your controller logic here...
// });

const deleteUser = async (req, res) => {
	if (!req?.body?.id) return res.status(400).json({ message: "User ID required" });
	const user = await User.findOne({ _id: req.body.id });
	if (!user) {
		return res.status(204).json({ message: `User ID ${req.body.id} not found` });
	}
	const result = await user.deleteOne({ _id: req.body.id });
	res.json(result);
};

const getUser = async (req, res) => {
	if (!req?.params?.id) return res.status(400).json({ message: "User ID required" });
	const user = await User.findById(req.params.id);
	if (!user) {
		return res.status(204).json({ message: `User ID ${req.params.id} not found` });
	}
	res.json(user);
};

module.exports = {
	getAllUsers,
	deleteUser,
	getUser,
};
