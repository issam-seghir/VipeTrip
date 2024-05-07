const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// const Post = mongoose.model("Post");

const commentSchema = new Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		replies: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		totalLikes: {
			type: Number,
			default: 0,
		},
		totalReplies: {
			type: Number,
			default: 0,
		},
		edited: {
			type: Boolean,
			default: false,
		},
		mentions: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

//? --------- virtual (set / get) methods ----------------

commentSchema.virtual("likedByUser");

//? --------- Middlewares ----------------

// Middleware to increments totalComments in Post  when user add Comment to a Post

// commentSchema.post("save", async function (doc) {
// 	if (doc.isNew) {
// 		// Check if it's a new document
// 		await Post.findByIdAndUpdate(doc.post, { $inc: { totalComments: 1 } });
// 	}
// });

// // Middleware to decrements totalComments in Post  when user add Comment to a Post

// commentSchema.post("deleteOne", async function (doc) {
// 	await Post.findByIdAndUpdate(doc.post, { $inc: { totalComments: -1 } });
// });

module.exports = mongoose.model("Comment", commentSchema);
