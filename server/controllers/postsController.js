const Post = require("@model/Post");
const User = require("@model/User");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");


const createPost = asyncWrapper(async (req, res) => {
		const { userId, description, mentions, tags } = req.body;
		const {images} = req.files;
		const attachments = req.files.map((file) => file.path); // Get paths of uploaded files

		// Check if the user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Create a new post
		const newPost = new Post({
			userId,
			description,
			attachments,
			mentions,
			tags,
		});
		await newPost.save();

		// Increase the post counts
		await User.findByIdAndUpdate(userId, { $inc: { totalPosts: 1 } });

		res.status(201).json(newPost);
});



const deletePost = asyncWrapper(async (req, res) => {
		const { postId } = req.params;
		// Find the post by ID and delete it
		const post = await Post.findByIdAndDelete(postId);

		// If the post was not found, send an error
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json({ message: "Post deleted successfully" });
});
const updatePost = asyncWrapper(async (req, res) => {
		const { postId } = req.params;
		const updateData = req.body;
		// const { userId, description, attachments, mentions, tags } = req.body;

		// Check if the post exists
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Check if the user is the author of the post
		if (post?.userId.toString() !== updateData?.userId) {
			return res.status(403).json({ message: "You can only update your own posts" });
		}

		// Update the post
		const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });

		// Update the post
		// post.description = description || post.description;
		// post.attachments = attachments || post.attachments;
		// post.mentions = mentions || post.mentions;
		// post.tags = tags || post.tags;
		// const updatedPost = await post.save();

		res.status(200).json(updatedPost);
});

const getFeedPosts = asyncWrapper(async (req, res) => {
		const page = Number.parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
		const limit = Number.parseInt(req.query.limit) || 10; // Get the limit from the query parameters, default to 10
		const skip = (page - 1) * limit;

		const posts = await Post.find()
			.sort({ createdAt: -1 }) // Sort by creation date in descending order
			.skip(skip) // Skip the posts before the current page
			.limit(limit) // Limit the number of posts
			.exec();

		const totalPosts = await Post.countDocuments();

		res.status(200).json({
			totalPosts,
			totalPages: Math.ceil(totalPosts / limit),
			currentPage: page,
			posts,
		});
});

const getUserPosts = asyncWrapper(async (req, res) => {
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const userExists = await User.find({ userId });
		if (!userExists) {
			return res.status(404).json({ message: "User not found" });
		}

		const posts = await Post.find({ userId }).sort({ createdAt: -1 }).exec();

		res.status(200).json(posts);
});

const getSinglePost = asyncWrapper(async (req, res) => {
	const { postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json(post);
});

const sharePost = asyncWrapper(async (req, res) => {
	const { postId } = req.params;
	const { userId, description, mentions, tags } = req.body;
	const attachments = req.files.map((file) => file.path); // Get paths of uploaded files

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Create a new post
		const newPost = new Post({
			userId,
			description,
			attachments,
			mentions,
			tags,
			sharedFrom: post._id,
		});

		await newPost.save();

		// Increase the share count of the original post
		await Post.findByIdAndUpdate(postId, { $inc: { totalShares: 1 } });

		res.status(200).json({ message: "Post shared successfully", newPost });
});


module.exports = {
	createPost,
	updatePost,
	deletePost,
	getFeedPosts,
	getUserPosts,
	getSinglePost,
	sharePost,
};
