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
	// Populate the 'liker' and 'likedPost' fields after saving the document
	const populatedComment = await Comment.findById(comment._id).populate("post");
	res.status(201).json({ message: "Comment Created  successfully", data: populatedComment });
});

const createReply = asyncWrapper(async (req, res) => {
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
	const parentComment = await Comment.findById(commentId);
	if (!parentComment) {
		return res.status(404).json({ message: "parent Comment not found" });
	}

	const mentionNames = mentions.map((mention) => mention.replace("@", ""));
	const mentionedUsers = await User.find({ fullName: { $in: mentionNames } });
	const mentionIds = mentionedUsers.map((user) => user.id);

	const NewDescription = description.replaceAll("\n", "\\n");

	const reply = new Comment({
		author: req.user.id,
		parentComment: commentId,
		post: postId,
		description: NewDescription,
		mentions: mentionIds,
	});

	await reply.save();

	parentComment.replies.push(reply);
	parentComment.totalReplies += 1; // Increment the totalReplies count of the parent comment
	await parentComment.save();

	res.status(201).json({ message: "Reply added successfully", data: reply });
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
	if (comment.author.id.toString() !== user.id) {
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
	if (comment.author.id.toString() !== user.id) {
		return res.status(403).json({ message: "User is not authorized to delete this comment" });
	}

	// If the comment is a top-level comment, decrement the totalComments count of the post
	if (comment.parentComment === null) {
		post.totalComments -= 1;
		await post.save();
	}

	// Check if the comment is a reply
	if (comment.parentComment !== null) {
		// Find the parent comment and decrement its totalReplies count
		const parentComment = await Comment.findById(comment.parentComment);
		if (parentComment) {
			parentComment.totalReplies -= 1;
			await parentComment.save();
		}
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

	// Get the IDs of the comments that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Comment" });
	const likedCommentsIds = new Set(userLikes.map((like) => like.likedComment._id.toString()));

	let comments = await Comment.find({ post: postId, parentComment: null })
		.sort({ createdAt: -1 }) // Sort by creation date in descending order
		.populate("author")
		.populate("replies");

	comments = await Promise.all(
		comments.map(async (comment) => {
			comment.likedByUser = likedCommentsIds.has(comment._id.toString()); // Set the likedByUser virtual property
			// fix preserving line break (new lines)
			comment.description = comment.description.replaceAll("\\n", "\n");

			if (comment?.replies) {
				// Check if the user has liked the replies
				comment.replies = comment.replies.map((reply) => {
					reply.likedByUser = likedCommentsIds.has(reply._id.toString());
					// fix preserving line break (new lines)
					reply.description = reply.description.replaceAll("\\n", "\n");
					return reply;
				});
			}

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
	// Populate the 'liker' and 'likedPost' fields after saving the document
	const populatedLike = await Like.findById(like._id).populate("liker").populate("likedComment");
	res.status(200).json({ message: "Comment liked successfully", data: populatedLike });
});

module.exports = {
	createComment,
	createReply,
	getAllComments,
	updateComment,
	deleteComment,
	likeDislikeComment,
};
