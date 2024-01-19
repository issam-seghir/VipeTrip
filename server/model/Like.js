const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		commentId: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
		postId: {
			type: Schema.Types.ObjectId,
			ref: "Post",
		},
		type: {
			type: String,
			enum: ["Post", "Comment"],
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Like", likeSchema);
