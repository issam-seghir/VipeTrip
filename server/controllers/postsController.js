const Post = require("@model/Post");
const User = require("@model/User");

/* CREATE */
const createPost = async (req, res) => {
	try {
		const { userId, description, mentions, tags } = req.body;
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

		res.status(201).json(newPost);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};
const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;
		// Find the post by ID and delete it
		const post = await Post.findByIdAndDelete(postId);

		// If the post was not found, send an error
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const updatePost = async (req, res) => {
	try {
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
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/* READ */
const getFeedPosts = async (req, res) => {
	try {
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
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getUserPosts = async (req, res) => {
	try {
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
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/* UPDATE */
const likePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;
		const post = await Post.findById(id);
		const isLiked = post.likes.get(userId);

		if (isLiked) {
			post.likes.delete(userId);
		} else {
			post.likes.set(userId, true);
		}

		const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

		res.status(200).json(updatedPost);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const Post = require("./Post");
const Comment = require("./Comment");
const Like = require("./Like");

const addLike = async (userId, postId, commentId) => {
	let like = new Like({ userId, postId, commentId, type: commentId ? "Comment" : "Post" });
	like = await like.save();

	if (commentId) {
		await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });
	} else {
		await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
	}

	return like;
};

const removeLike = async (likeId) => {
	const like = await Like.findById(likeId);
	if (!like) {
		throw new Error("Like not found");
	}

	if (like.commentId) {
		await Comment.findByIdAndUpdate(like.commentId, { $inc: { likesCount: -1 } });
	} else {
		await Post.findByIdAndUpdate(like.postId, { $inc: { likesCount: -1 } });
	}

	await Like.findByIdAndRemove(likeId);
};

module.exports = {
	createPost,
	updatePost,
	deletePost,
	getFeedPosts,
	getUserPosts,
	likePost,
};
