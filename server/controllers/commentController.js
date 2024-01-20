const Comment = require("@model/Comment");
const User = require("@model/User");
const Post = require("@model/Post");

// Create Comment
const createComment = async (req, res) => {
	try {
		const { userId, postId, description, mentions } = req.body;
		const user = await User.findById(userId);
		const post = await Post.findById(postId);
		if (!user || !post) {
			return res.status(404).json({ message: "User or Post not found" });
		}

		const newComment = new Comment({
			userId,
			postId,
			description,
			mentions,
		});
		await newComment.save();

		res.status(201).json(newComment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

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
const getAllComments = async (req, res) => {
	try {
		const { postId } = req.params;
		const comments = await Comment.find({ postId }).populate("userId").populate("replies");

		res.json(comments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update Comment
const updateComment = async (req, res) => {
	try {
		const { commentId, description } = req.body;
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		comment.description = description;
		comment.edited = true;
		await comment.save();

		res.json(comment);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete Comment
const deleteComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		await comment.remove();

		res.json({ message: "Comment deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
    createComment,
    addReplyToComment,
    getAllComments,
    updateComment,
	deleteComment,
};
