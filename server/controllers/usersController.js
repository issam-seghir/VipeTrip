const User = require("@model/User");
const Post = require("@model/Post");
const Like = require("@model/Like");
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

	const user = await User.findById(req.params.id).populate("bookmarkedPosts");

	// Get the IDs of the posts that the user has bookmarked
	if (!user) {
		return next(new createError.NotFound("User not found"));
	}
	// Get the IDs of the posts that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Post" });
	const likedPostIds = new Set(userLikes.map((like) => like.likedPost._id.toString()));

	// Fetch the first three likers for each post
	const likes = await Like.aggregate([
		{ $match: { likedPost: { $in: user.bookmarkedPosts.map((post) => post._id) }, type: "Post" } },
		{
			$group: {
				_id: "$likedPost",
				likers: { $push: "$liker" },
			},
		},
		{
			$project: {
				_id: 1,
				likers: { $slice: ["$likers", 3] },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "likers",
				foreignField: "_id",
				as: "likers",
			},
		},
		{
			$project: {
				password: 0,
				email: 0,
				rememberMe: 0,
				"socialAccounts.accessToken": 0,
				refreshToken: 0,
			},
		},
	]);

	// Map the likes to a Map object for easier access
	const likesMap = new Map(likes.map((like) => [like._id.toString(), like.likers]));

	// Update the posts with the likedByUser, bookmarkedByUser, and firstThreeLikers properties
	user.bookmarkedPosts = user.bookmarkedPosts.map((post) => {
		post.likedByUser = likedPostIds.has(post._id.toString());
		post.bookmarkedByUser = true;
		post.firstThreeLikers = likesMap.get(post._id.toString()) || [];
		return post;
	});

	res.json({ success: "get user success", data: user });
});

const getCurrentUser = asyncWrapper(async (req, res, next) => {

	if (!req?.user?.id) return next(new createError.BadRequest("User ID required"));

	const user = await User.findById(req.user.id).populate("bookmarkedPosts");

	// Get the IDs of the posts that the user has bookmarked
	if (!user) {
		return next(new createError.NotFound("User not found"));
	}
	// Get the IDs of the posts that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Post" });
	const likedPostIds = new Set(userLikes.map((like) => like.likedPost._id.toString()));

	// Fetch the first three likers for each post
	const likes = await Like.aggregate([
		{ $match: { likedPost: { $in: user.bookmarkedPosts.map((post) => post._id) }, type: "Post" } },
		{
			$group: {
				_id: "$likedPost",
				likers: { $push: "$liker" },
			},
		},
		{
			$project: {
				_id: 1,
				likers: { $slice: ["$likers", 3] },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "likers",
				foreignField: "_id",
				as: "likers",
			},
		},
		{
			$project: {
				password: 0,
				email: 0,
				rememberMe: 0,
				"socialAccounts.accessToken": 0,
				refreshToken: 0,
			},
		},
	]);

	// Map the likes to a Map object for easier access
	const likesMap = new Map(likes.map((like) => [like._id.toString(), like.likers]));

	// Update the posts with the likedByUser, bookmarkedByUser, and firstThreeLikers properties
	user.bookmarkedPosts = user.bookmarkedPosts.map((post) => {
		post.likedByUser = likedPostIds.has(post._id.toString());
		post.bookmarkedByUser = true;
		post.firstThreeLikers = likesMap.get(post._id.toString()) || [];
		return post;
	});

	res.json({ success: "get user success", data: user });
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
	getCurrentUser,
	updateUser,
	deleteUser,
};
