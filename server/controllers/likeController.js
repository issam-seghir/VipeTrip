const Comment = require("@model/Comment");
const Like = require("@model/Like");
const Post = require("@model/Post");

const addLike = async (req, res) => {
	const { userId, postId, commentId } = req.body;

	// Validate the input data
	if (!userId || (!postId && !commentId)) {
		return res.status(400).json({ message: "Invalid input data" });
	}

	try {
		let like = new Like({ userId, postId, commentId, type: commentId ? "Comment" : "Post" });
		like = await like.save();

		await (commentId ? Comment.findByIdAndUpdate(commentId, { $inc: { totalLikes: 1 } }) : Post.findByIdAndUpdate(postId, { $inc: { totalLikes: 1 } }));

		res.status(200).json({ message: "Like added successfully", like });
	} catch (error) {
		res.status(500).json({ message: "An error occurred", error });
	}
};

const removeLike = async (req, res) => {
	const { likeId } = req.params;

	// Validate the input data
	if (!likeId) {
		return res.status(400).json({ message: "Invalid input data" });
	}

	try {
		const like = await Like.findById(likeId);
		if (!like) {
			return res.status(404).json({ message: "Like not found" });
		}

		await (like.commentId ? Comment.findByIdAndUpdate(like.commentId, { $inc: { totalLikes: -1 } }) : Post.findByIdAndUpdate(like.postId, { $inc: { totalLikes: -1 } }));

		await Like.findByIdAndRemove(likeId);

		res.status(200).json({ message: "Like removed successfully" });
	} catch (error) {
		res.status(500).json({ message: "An error occurred", error });
	}
};



module.exports = {
	addLike,
    removeLike
};
