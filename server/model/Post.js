const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			autopopulate: true,
		},
		sharedFrom: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			required: true,
			autopopulate: true,
		},
		description: {
			type: String,
			required: true,
		},
		attachments: [
			{
				type: String,
			},
		],
		totalLikes: {
			type: Number,
			default: 0,
		},
		totalComments: {
			type: Number,
			default: 0,
		},
		totalShares: {
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
		tags: [
			{
				type: String,
				trim: true,
				default: [],
			},
		],
	},
	{ timestamps: true }
);





postSchema.plugin(autopopulate);

module.exports = mongoose.model("Post", postSchema);
