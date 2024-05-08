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
	// fix preserving line break (new lines)
	const NewDescription = description.replaceAll("\n", "\\n");
	const comment = new Comment({
		author: req.user.id,
		post: postId,
		description: NewDescription,
		replies: [],
		mentions: mentionIds, // Store ObjectId of mentioned users
	});

	//TODO If your app supports notifications, send a notification to users who are mentioned in the updated comment
	// This will depend on how you've implemented notifications. Here's a general idea:
	// mentionedUsers.forEach((user) => {
	// 	Notification.create({
	// 		user: user.id,
	// 		message: `${req.user.name} mentioned you in a comment`,
	// 		link: `/posts/${postId}/comments/${commentId}`,
	// 	});
	// });

	//TODO If your app supports real-time updates, send a message to all connected clients to inform them of the update
	// This will depend on how you've implemented real-time updates. If you're using Socket.IO, it might look something like this:
	// io.emit("commentUpdated", { commentId, postId, description, mentions: mentionIds });

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

	//TODO If your app supports notifications, send a notification to users who are mentioned in the updated comment
	// This will depend on how you've implemented notifications. Here's a general idea:
	// mentionedUsers.forEach((user) => {
	// 	Notification.create({
	// 		user: user.id,
	// 		message: `${req.user.name} mentioned you in a comment`,
	// 		link: `/posts/${postId}/comments/${commentId}`,
	// 	});
	// });

	//TODO If your app supports real-time updates, send a message to all connected clients to inform them of the update
	// This will depend on how you've implemented real-time updates. If you're using Socket.IO, it might look something like this:
	// io.emit("commentUpdated", { commentId, postId, description, mentions: mentionIds });

	// fix preserving line break (new lines)
	comment.description = description.replaceAll("\n", "\\n");

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
		return res.status(200).json({ message: "Comment already deleted or not found" });
	}

	// Check if the user is the author of the comment
	if (comment.author.toString() !== user.id) {
		return res.status(403).json({ message: "User is not authorized to delete this comment" });
	}

	// Decrement the comment count of the post
	post.totalComments -= 1;
	await post.save();

	// If the comment is a reply, decrement the totalReplies count of the parent comment and remove it from parent comment's replies
	const parentComment = await Comment.findOne({ replies: commentId });
	if (parentComment) {
		await Comment.updateOne(
			{ _id: parentComment._id },
			{ $pull: { replies: commentId }, $inc: { totalReplies: -1 } }
		);
	}
	// Delete all replies associated with the comment
	await Comment.deleteMany({ _id: { $in: comment.replies } });

	// Delete all likes associated with the post
	await Like.deleteMany({ likedComment: commentId, type: "Comment" });

	//TODO Delete or update any notifications related to the deleted comment
	// await Notification.deleteMany({ relatedComment: commentId });

	// Find the post by ID and delete it
	await Comment.findByIdAndDelete(commentId);

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

	// Check if the user exists
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	const post = await Post.findById(postId);
	if (!post) {
		return res.status(404).json({ message: "Post not found" });
	}

	// Get the IDs of the posts that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Comment" });
	const likedCommentsIds = new Set(userLikes.map((like) => like.likedComment._id.toString()));

	let comments = await Comment.find({ post: postId })
		.sort({ createdAt: -1 }) // Sort by creation date in descending order
		.populate("author")
		.populate("replies");

	comments = await Promise.all(
		comments.map(async (comment) => {
			comment.likedByUser = likedCommentsIds.has(comment._id.toString()); // Set the likedByUser virtual property
			// fix preserving line break (new lines)
			comment.description = comment.description.replaceAll("\\n", "\n");
			return comment;
		})
	);

	res.status(201).json({ message: "get All comments", data: comments });
});

/**
 * @typedef {import('@validations/commentSchema').commentSchemaBody} commentSchemaBody
 */
const likeDislikeComment = asyncWrapper(async (req, res, next) => {
	/** @type {commentSchemaBody} */
	const { postId, commentId } = req.params;
	const userId = req?.user?.id;

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
		return res.status(200).json({ message: "Comment already deleted or not found" });
	}

	// Check if the user has already liked the post
	const existingLike = await Like.findOne({ likedComment: commentId, liker: userId, type: "Comment" });
	if (existingLike) {
		// If the user has already liked the post, delete the document
		await Like.findOneAndDelete({ _id: existingLike._id });
		return res.status(200).json({ message: "Comment unliked successfully" });
	}

	// If the user has not liked the post, create a new Like document
	const like = new Like({ likedComment: commentId, liker: userId, type: "Comment" });
	await like.save();

	res.status(200).json({ message: "Comment liked successfully" });
});

module.exports = {
	createComment,
	addReplyToComment,
	getAllComments,
	updateComment,
	deleteComment,
	likeDislikeComment,
};
