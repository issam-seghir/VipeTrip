const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");
const mongooseAlgolia = require("@issam-seghir/mongoose-algolia").algoliaIntegration;
const { ENV } = require("@/validations/envSchema");

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		author: {
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
		privacy: {
			type: String,
			enum: ["onlyMe", "friends", "public"],
			default: "public",
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

// Algolia Search Plugin
postSchema.plugin(autopopulate);

postSchema.plugin(mongooseAlgolia, {
	appId: ENV.ALGOLIA_APP_ID,
	apiKey: ENV.ALGOLIA_ADMIN_API_KEY,
	indexName: "posts", //The name of the index in Algolia, you can also pass in a function
	selector: "-password -email -rememberMe -socialAccounts.accessToken -refreshToken", //  You can decide which field that are getting synced to Algolia (same as selector in mongoose)
	populate: {
		path: "userId",
		select: "author",
	},
	// If you want to prevent some documents from being synced to algolia
	// },
	// filter: function (doc) {
	// 	return !doc.softdelete;
	// },
	debug: true, //  logged out in your console
});

let Post = mongoose.model("Post", postSchema);

Post.syncToAlgolia()
	.then(() => {
		console.log("All posts have been synced to Algolia");
	})
	.catch((error) => {
		console.error("Error syncing posts to Algolia", error);
	});

module.exports = Post;
