const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		userTo: {
			// The user who will receive the notification
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userFrom: {
			// The user who triggered the notification
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: "Post",
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
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
