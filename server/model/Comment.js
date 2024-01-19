const mongoose = require("mongoose");

const Schema = mongoose.Schema;
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
		likes: {
			type: Number,
			default: 0,
		},
		edited: {
			type: Boolean,
			default: false,
		},
		attachments: [
			{
				type: String,
			},
		],
		mentions: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
