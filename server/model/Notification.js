const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["Post", "Comment", "Like", "Friend"],
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
		postId: {
			type: Schema.Types.ObjectId,
			ref: "Post",
		},
		commentId: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
		likeId: {
			type: Schema.Types.ObjectId,
			ref: "Like",
		},
		friendId: {
			type: Schema.Types.ObjectId,
			ref: "FriendShip",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
