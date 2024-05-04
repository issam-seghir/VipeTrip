const User = require("@model/User");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const { ObjectIdSchema } = require("@utils/zodUtils");
const createError = require("http-errors");

const getAllUsers = asyncWrapper(async (req, res, next) => {
	const users = await User.find();
	if (!users || users.length === 0) return next(new createError.NotFound("No user(s) found"));

	res.json({ success: "get all users success", users });
});
const getUser = asyncWrapper(async (req, res, next) => {
	try {
		ObjectIdSchema.parse(req.params.id); //pass the validation
	} catch (error) {
		return next(new createError.BadRequest(error));
	}

	if (!req?.params?.id) return next(new createError.BadRequest("User ID required"));

	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new createError.NotFound("User not found"));
	}

	 await user.incrementViewedProfile();
	res.json({ success: "get user success", user });
});

const updateUser = asyncWrapper(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
	if (!user) {
		return next(new createError.NotFound("User not found"));
	}
	res.json({ success: "User updated successfully", user });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.user.id);
	if (!user) {
		return next(new createError.NotFound("User not found"));
	}
	res.json({ success: "User deleted successfully" });
});

module.exports = {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
};
