const Post = require("@model/Post");
const User = require("@model/User");
const Like = require("@model/Like");
const mongoose = require("mongoose");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");

/**
 * @typedef {import('@validations/postSchema').createPostSchemaBody} createPostSchemaBody
 */

const createPost = asyncWrapper(async (req, res) => {
	/** @type {createPostSchemaBody} */
	const { description, mentions, tags, privacy } = req.body;
	const images = req?.files?.map((file) => file.path.replace("public\\", "")) || [];

	// Check if the user exists
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	// Remove the '@' from each mention
	const mentionNames = mentions.map((mention) => mention.replace("@", ""));
	// Find all mentioned users by their firstName or lastName
	const mentionedUsers = await User.find({ fullName: { $in: mentionNames } });
	const mentionIds = mentionedUsers.map((user) => user.id);

	const newPost = new Post({
		author: user,
		privacy,
		description,
		images,
		mentions: mentionIds, // Store ObjectId of mentioned users
		tags,
	});
	await newPost.save();

	res.status(201).json({ message: "Post Created  successfully" });
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

const getAllPosts = asyncWrapper(async (req, res) => {
	const page = Number.parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
	const limit = Number.parseInt(req.query.limit) || 10; // Get the limit from the query parameters, default to 10
	const skip = (page - 1) * limit;

	let posts = await Post.find()
		.sort({ createdAt: -1 }) // Sort by creation date in descending order
		.skip(skip) // Skip the posts before the current page
		.limit(limit); // Limit the number of posts
  const user = await User.findById(req.user.id);

  posts = await Promise.all(
		posts.map(async (post) => {
			if (!post.viewedBy.includes(user.id)) {
				post.viewedBy.push(user.id);
				await post.save();
			}
			// If the post belongs to the user, increment the user's postsImpressions
			if (post.author.equals(user.id)) {
				user.postImpressions++;
				await user.save();
			}
			return post;
		})
  );

	// console.log(posts);
	res.status(201).json({ message: "Get all Posts successfully", data: posts });
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
	post.incrementImpressions();

	res.status(200).json(post);
});

const sharePost = asyncWrapper(async (req, res) => {
	const { postId } = req.params;
	const { userId, description, mentions, tags } = req.body;
	const attachments = req.files.map((file) => file.path); // Get paths of uploaded files

	const originalPost = await Post.findById(postId);
	if (!originalPost) {
		return res.status(404).json({ message: "Post not found" });
	}

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	// Create a new post
	const sharedPost = new Post({
		userId,
		description,
		attachments,
		mentions,
		tags,
		sharedFrom: originalPost._id,
	});

	await sharedPost.save();

	// Increase the share count of the original post
	await originalPost.incrementShares();

	res.status(200).json({ message: "Post shared successfully", data: sharedPost });
});

const likeDislikePost = asyncWrapper(async (req, res, next) => {
	const { postId } = req.params;
	const userId = req?.user?.id;

	const post = await Post.findById(postId);
	if (!post) {
		return next(new Error("Post not found"));
	}

	const user = await User.findById(userId);
	if (!user) {
		return next(new Error("User not found"));
	}

	// Check if the user has already liked the post
	const existingLike = await Like.findOne({ postId, userId, type: "Post" });
	if (existingLike) {
		// If the user has already liked the post, delete the Like document
		await Like.deleteOne({ _id: existingLike._id });
		return res.status(200).json({ message: "Post unliked successfully" });
	}

	// If the user has not liked the post, create a new Like document
	const like = new Like({ postId, userId, type: "Post" });
	await like.save();

	res.status(200).json({ message: "Post liked successfully",data: like });
});

module.exports = {
	createPost,
	updatePost,
	deletePost,
	getAllPosts,
	getUserPosts,
	getSinglePost,
	likeDislikePost,
	sharePost,
};
