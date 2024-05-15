const Post = require("@model/Post");
const User = require("@model/User");
const Like = require("@model/Like");
const Comment = require("@model/Comment");
const mongoose = require("mongoose");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");
const fs = require("node:fs");
const path = require("node:path");

const { POSTS_DIR } = require("@middleware/multer/multerUploader");

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

	res.status(201).json({ message: "Post Created  successfully", data: newPost });
});

const deletePost = asyncWrapper(async (req, res, next) => {
	const { postId } = req.params;
	const userId = req?.user?.id;
	// Find the post by ID
	const post = await Post.findById(postId);
	const user = await User.findById(userId);
	// If the post was not found, send an error
	if (!post) {
		return res.status(404).json({ message: "Post not found" });
	}
	// Check if the user is authorized to delete the post
	if (post.author.id.toString() !== userId) {
		return next(new Error("You are not authorized to delete this post"));
	}

	// Delete the images
	post.images.forEach((image) => {
		const imagePath = path.join(process.cwd(), "public", image);
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fs.unlink(imagePath, (err) => {
			if (err) {
				console.error(err);
			}
		});
	});

	// Delete all comments associated with the post
	await Comment.deleteMany({ post: postId });

	// Delete all likes associated with the post
	await Like.deleteMany({ likedPost: postId, type: "Post" });
	// Delete All bookmarks associated with the post
	await User.updateMany({}, { $pull: { bookmarkedPosts: postId } });

	// If the post is a shared post, decrement the totalShares count of the original post
	if (post.sharedFrom) {
		await Post.updateOne({ _id: post.sharedFrom }, { $inc: { totalShares: -1 } });
	}
	// Delete All shared post associated with the post
	await Post.deleteMany({ sharedFrom: postId });

	// Find the post by ID and delete it
	await Post.findByIdAndDelete(postId);

	res.status(200).json({ message: "Post deleted successfully" });
});
const updatePost = asyncWrapper(async (req, res, next) => {
	const { postId } = req.params;
	const userId = req.user.id;
	const { description, mentions = [], tags = [], privacy, existingImages = [] } = req.body;
	const images = req?.files?.map((file) => file.path.replace("public\\", "")) || [];

	console.log(images);
	console.log(req.body);
	// Check if the user exists
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	// Check if the post exists
	const post = await Post.findById(postId);
	if (!post) {
		return res.status(404).json({ message: "Post not found" });
	}
	// Check if the user is authorized to delete the post
	if (post.author.id.toString() !== userId) {
		return next(new Error("You are not authorized to edit this post"));
	}

	// Filter out images that will be  deleted from server
	const deletedImages = post?.images.filter((img) => !existingImages.includes(img));
	const keepedImages = post?.images.filter((img) => existingImages.includes(img));
	const newImages = [...keepedImages, ...images];
	// Delete the images
	deletedImages.forEach((image) => {
		const imagePath = path.join(process.cwd(), "public", image);
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fs.unlink(imagePath, (err) => {
			if (err) {
				console.error(`Failed to delete image ${image}:`, err);
			}
		});
	});

	// Remove the '@' from each mention
	const mentionNames = mentions.map((mention) => mention.replace("@", ""));
	// Find all mentioned users by their firstName or lastName
	const mentionedUsers = await User.find({ fullName: { $in: mentionNames } });
	const mentionIds = mentionedUsers.map((user) => user.id);

	// // Define the update data
	const updateData = {
		description: description || post.description,
		edited: true,
		mentions: mentionIds || post.mentions,
		tags: tags || post.tags,
		privacy: privacy || post.privacy,
		images: newImages || post.images,
	};
	const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });

	res.status(200).json({ message: "Post updated successfully", data: updatedPost });
});

const getAllPosts = asyncWrapper(async (req, res) => {
	const page = Number.parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1
	const limit = Number.parseInt(req.query.limit) || 5; // Get the limit from the query parameters, default to 10
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const user = await User.findById(req.user.id);

	// Get the IDs of the posts that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Post" });
	const likedPostIds = new Set(userLikes.map((like) => like.likedPost._id.toString()));

	// Get the IDs of the posts that the user has bookmarked
	const bookmarkedPostIds = new Set(user.bookmarkedPosts.map((post) => post._id.toString()));
	let posts = await Post.find()
		.sort({ createdAt: -1 }) // Sort by creation date in descending order
		.skip(startIndex) // Skip the posts before the current page
		.limit(limit); // Limit the number of posts
	const total = await Post.countDocuments();
	const hasNextPage = endIndex < total;

	const viewedPosts = new Set();
	let postImpressions = 0;

	posts = await Promise.all(
		posts.map(async (post) => {
			post.likedByUser = likedPostIds.has(post._id.toString()); // Set the likedByUser virtual property
			post.bookmarkedByUser = bookmarkedPostIds.has(post._id.toString()); // Set the bookmarkedByUser virtual property
			// Fetch three random likers
			const likes = await Like.aggregate([
				{ $match: { likedPost: post._id, type: "Post" } },
				{ $sample: { size: 3 } },
				{
					$lookup: {
						from: "users",
						localField: "liker",
						foreignField: "_id",
						as: "liker",
					},
				},
				{ $unwind: "$liker" },
				{
					$project: {
						password: 0,
						email: 0,
						rememberMe: 0,
						"socialAccounts.accessToken": 0,
						refreshToken: 0,

						// ...
					},
				},
			]);
			post.firstThreeLikers = likes.map((like) => {
				// Transform the liker document
				const liker = like.liker;
				liker.id = liker._id;
				delete liker._id;
				delete liker.__v;
				delete liker.password;
				delete liker.socialAccounts.accessToken;
				delete liker.refreshToken;
				delete liker.rememberMe;
				delete liker.email;
				return liker;
			});

			return post;
		})
	);
	// posts = posts.map((post) => {

	// 	if (!post.viewedBy.includes(user.id)) {
	// 		post.viewedBy.push(user.id);
	// 		viewedPosts.add(post._id);
	// 	}
	// 	// If the post belongs to the user, increment the user's postsImpressions
	// 	if (post.author === user.id.toString()) {
	// 		postImpressions++;
	// 	}
	// 	return postWithLikedByUser;
	// });

	// // Update the viewedBy field of each post
	// if (viewedPosts.size > 0) {
	// 	await Post.updateMany({ _id: { $in: [...viewedPosts] } }, { $push: { viewedBy: user.id } });
	// }

	// // Update the postImpressions field of the user
	// if (postImpressions > 0) {
	// 	await User.updateOne({ _id: user.id }, { $inc: { postImpressions: postImpressions } });
	// }

	// console.log(posts);
	res.status(201).json({
		message: "Get all Posts successfully",
		data: posts,
		page: page,
		limit: limit,
		hasNextPage: hasNextPage,
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

	const user = await User.findById(req.user.id);

	// Get the IDs of the posts that the user has liked
	const userLikes = await Like.find({ liker: user.id, type: "Post" });
	const likedPostIds = new Set(userLikes.map((like) => like.likedPost._id.toString()));

	// Get the IDs of the posts that the user has bookmarked
	const bookmarkedPostIds = new Set(user.bookmarkedPosts.map((post) => post._id.toString()));
	post.likedByUser = likedPostIds.has(post._id.toString()); // Set the likedByUser virtual property
	post.bookmarkedByUser = bookmarkedPostIds.has(post._id.toString()); // Set the bookmarkedByUser virtual property
	// Fetch three random likers
	const likes = await Like.aggregate([
		{ $match: { likedPost: post._id, type: "Post" } },
		{ $sample: { size: 3 } },
		{
			$lookup: {
				from: "users",
				localField: "liker",
				foreignField: "_id",
				as: "liker",
			},
		},
		{ $unwind: "$liker" },
		{
			$project: {
				password: 0,
				email: 0,
				rememberMe: 0,
				"socialAccounts.accessToken": 0,
				refreshToken: 0,

				// ...
			},
		},
	]);
	post.firstThreeLikers = likes.map((like) => {
		// Transform the liker document
		const liker = like.liker;
		liker.id = liker._id;
		delete liker._id;
		delete liker.__v;
		delete liker.password;
		delete liker.socialAccounts.accessToken;
		delete liker.refreshToken;
		delete liker.rememberMe;
		delete liker.email;
		return liker;
	});

	res.status(201).json({ message: "Get SIngle Post successfully", data: post });
});

const repostPost = asyncWrapper(async (req, res) => {
	const { postId } = req.params;
	const userId = req.user.id;

	const originalPost = await Post.findById(postId);
	if (!originalPost) {
		return res.status(404).json({ message: "Post not found" });
	}

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	// Create a new post with a reference to the original post
	const sharedPost = new Post({
		author: userId,
		privacy: originalPost.privacy,
		description: originalPost.description,
		images: [], // Initialize images as an empty array
		mentions: originalPost.mentions,
		tags: originalPost.tags,
		sharedFrom: originalPost._id,
	});

	// Copy original images
	originalPost?.images.forEach((image) => {
		const originalImagePath = path.join(process.cwd(), "public", image);
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const newImageName = `shared-${uniqueSuffix}${path.extname(image)}`;
		const newImagePath = path.join(process.cwd(), "public/posts", newImageName);
		try {
			fs.copyFileSync(originalImagePath, newImagePath);
			sharedPost.images.push(path.join("posts", newImageName));
		} catch (error) {
			console.error(`Failed to copy image ${originalImagePath}:`, error);
		}
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
	const existingLike = await Like.findOne({ likedPost: postId, liker: userId, type: "Post" });
	if (existingLike) {
		// If the user has already liked the post, delete the document
		await Like.findOneAndDelete({ _id: existingLike._id });
		return res.status(200).json({ message: "Post unliked successfully" });
	}

	// If the user has not liked the post, create a new Like document
	const like = new Like({ likedPost: postId, liker: userId, type: "Post" });
	await like.save();
	// Populate the 'liker' and 'likedPost' fields after saving the document
	const populatedLike = await Like.findById(like._id).populate("liker").populate("likedPost");

	res.status(200).json({ message: "Post liked successfully", data: populatedLike });
});

const bookmarkPost = asyncWrapper(async (req, res, next) => {
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

	// Check if the post is already bookmarked
	const postIndex = user.bookmarkedPosts.indexOf(postId);
	if (postIndex === -1) {
		// If the post is not bookmarked, add it to the bookmarks
		await User.findByIdAndUpdate(userId, { $addToSet: { bookmarkedPosts: postId } });
		res.send({ message: "Post bookmarked successfully" });
	} else {
		// If the post is already bookmarked, remove it from the bookmarks
		await User.findByIdAndUpdate(userId, { $pull: { bookmarkedPosts: postId } });
		res.send({ message: "Post unbookmarked successfully" });
	}
});

const getPostLikers = asyncWrapper(async (req, res, next) => {
	const { postId } = req.params;

	const post = await Post.findById(postId);
	if (!post) {
		return next(new Error("Post not found"));
	}

	const likes = await Like.find({ likedPost: postId, type: "Post" }).populate("liker");
	const likers = likes.map((like) => like.liker);

	res.status(200).json({ message: "Post likers fetched successfully", data: likers });
});

module.exports = {
	createPost,
	updatePost,
	deletePost,
	getAllPosts,
	getUserPosts,
	getPostLikers,
	getSinglePost,
	likeDislikePost,
	bookmarkPost,
	repostPost,
};
