const Comment = require("@model/Comment");
const User = require("@model/User");
const Post = require("@model/Post");
const Like = require("@model/Like");

const { asyncWrapper } = require("@middleware/asyncWrapper");

/**
 * @typedef {import('@validations/commentSchema').commentSchemaBody} commentSchemaBody
 */

const createComment = asyncWrapper(async (req, res) => {
	/** @type {commentSchemaBody} */
	const { description, mentions } = req.body;
	const { postId } = req.params;

	// Check if the user exists
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	const post = await Post.findById(postId);
	if (!post) {
		return res.status(404).json({ message: "Post not found" });
	}
	post.totalComments += 1;
	await post.save();

	// Remove the '@' from each mention
	const mentionNames = mentions.map((mention) => mention.replace("@", ""));
	// Find all mentioned users by their firstName or lastName
	const mentionedUsers = await User.find({ fullName: { $in: mentionNames } });
	const mentionIds = mentionedUsers.map((user) => user.id);

	const comment = new Comment({
		author: req.user.id,
		post: postId,
		description,
		replies: [],
		mentions: mentionIds, // Store ObjectId of mentioned users
	});

	await comment.save();

	res.status(201).json({ message: "Comment Created  successfully", data: comment });
});

/**
 * @typedef {import('@validations/commentSchema').commentSchemaBody} commentSchemaBody
 */

const updateComment = asyncWrapper(async (req, res) => {
	/** @type {commentSchemaBody} */
	const { description, mentions } = req.body;
	const { postId, commentId } = req.params;

	// Check if the user exists
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	const post = await Post.findById(postId);
	if (!post) {
		return res.status(404).json({ message: "Post not found" });
	}

	const comment = await Comment.findById(commentId);
	if (!comment) {
		return res.status(404).json({ message: "Comment not found" });
	}

	// Check if the user is the author of the comment
	if (comment.author.toString() !== user.id) {
		return res.status(403).json({ message: "User is not authorized to update this comment" });
	}

	// Remove the '@' from each mention
	const mentionNames = mentions.map((mention) => mention.replace("@", ""));
	// Find all mentioned users by their firstName or lastName
	const mentionedUsers = await User.find({ fullName: { $in: mentionNames } });
	const mentionIds = mentionedUsers.map((user) => user.id);

	comment.description = description;
	comment.mentions = mentionIds;
	comment.edited = true;

	await comment.save();

	res.status(201).json({ message: "Comment updated  successfully", data: comment });
});

/**
 * @typedef {import('@validations/commentSchema').commentSchemaBody} commentSchemaBody
 */

const deleteComment = asyncWrapper(async (req, res) => {
	/** @type {commentSchemaBody} */
	const { postId, commentId } = req.params;

	// Check if the user exists
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	const post = await Post.findById(postId);
	if (!post) {
		return res.status(404).json({ message: "Post not found" });
	}

	const comment = await Comment.findById(commentId);
	if (!comment) {
		return res.status(404).json({ message: "Comment not found" });
	}

	// Check if the user is the author of the comment
	if (comment.author.toString() !== user.id) {
		return res.status(403).json({ message: "User is not authorized to delete this comment" });
	}

	// Delete the comment
	await comment.remove();

	res.status(200).json({ message: "Comment Deleted  successfully" });
});

// Add Reply to Comment
const addReplyToComment = async (req, res) => {
	try {
		const { commentId, replyId } = req.body;
		const comment = await Comment.findById(commentId);
		const reply = await Comment.findById(replyId);
		if (!comment || !reply) {
			return res.status(404).json({ message: "Comment or Reply not found" });
		}

		comment.replies.push(replyId);
		await comment.save();

		res.json(comment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get All Comments for a Post
const getAllComments = asyncWrapper(async (req, res) => {
	const { postId } = req.params;

	const user = await User.findById(req.user.id);

	// Get the IDs of the posts that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Comment" });
	const likedCommentsIds = new Set(userLikes.map((like) => like.likedComment._id.toString()));

	let comments = await Comment.find({ post: postId }).populate("author").populate("replies");

	comments = await Promise.all(
		comments.map(async (comment) => {
			comment.likedByUser = likedCommentsIds.has(comment._id.toString()); // Set the likedByUser virtual property
			return comment;
		})
	);

	res.status(201).json({ message: "get All comments", data: comments });
});

module.exports = {
	createComment,
	addReplyToComment,
	getAllComments,
	updateComment,
	deleteComment,
};
