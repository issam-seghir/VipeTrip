const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Post = mongoose.model("Post");


const commentSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		postId: {
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
		edited: {
			type: Boolean,
			default: false,
		},
		mentions: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

//? --------- Middlewares ----------------

// Middleware to increments totalComments in Post  when user add Comment to a Post

commentSchema.pre("save", function (next) {
	Post.updateOne({ _id: this.postId }, { $inc: { totalComments: 1 } }, next);
});

// Middleware to decrements totalComments in Post  when user add Comment to a Post

commentSchema.pre("remove", function (next) {
	Post.updateOne({ _id: this.postId }, { $inc: { totalComments: -1 } }, next);
});

module.exports = mongoose.model("Comment", commentSchema);
