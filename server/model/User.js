const mongoose = require("mongoose");
const { normalize } = require("@utils/plugins");
const mongooseAlgolia = require("@avila-tek/mongoose-algolia").algoliaIntegration;
const { ENV } = require("@/validations/envSchema");

const Schema = mongoose.Schema;

let userSchema = new Schema(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: [true, "email is required"],
			private: true,
			unique: true,
		},
		password: {
			type: String,
			private: true,
		},
		rememberMe: {
			type: Boolean,
			private: true,
			default: true,
		},
		socialAccounts: [
			{
				provider: {
					type: String,
					required: true,
				},
				profileId: {
					type: String,
					required: true,
				},
				displayName: {
					type: String,
					required: true,
				},
				accessToken: {
					type: String,
					private: true,
				},
			},
		],
		picturePath: {
			type: String,
			default: "https://i.imgur.com/zTSAKyM.png",
		},
		coverPath: {
			type: String,
			default: "https://placehold.co/1200x400/ffe5a6/FFF",
		},
		totalPosts: {
			type: Number,
			default: 0,
		},
		location: String,
		job: String,
		viewedProfile: {
			type: Number,
			default: 1,
		},
		impressions: {
			type: Number,
			default: 1,
		},
		refreshToken: {
			type: String,
			private: true,
		},
	},
	{
		timestamps: true,
	}
);

//* Apply plugins
// normalize : remove _id and __v and private field  from the response
userSchema.plugin(normalize);

// Algolia Search Plugin
userSchema.plugin(mongooseAlgolia, {
	appId: ENV.ALGOLIA_APP_ID,
	apiKey: ENV.ALGOLIA_ADMIN_API_KEY,
	indexName: "users", //The name of the index in Algolia, you can also pass in a function
	selector: "-password -socialAccounts.accessToken", //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
	// populate: {
	// 	path: "comments",
	// 	select: "author",
	// },
	defaults: {
		firstName: "unknown",
		lastName: "unknown",
		job: "unknown",
		location: "unknown",
	},
	// mappings: {
	// 	name: function (value) {
	// 		//Value is the 'name' object
	// 		return `${value.firstName} ${value.lastName}`; //ES6 is awesome :)
	// 	},
	// },
	// virtuals: {
	// 	whatever: function (doc) {
	// 		return `Custom data ${doc.title}`;
	// 	},
	// },
	// filter: function (doc) {
	// 	return !doc.softdelete;
	// },
	debug: true, // Default: false -> If true operations are logged out in your console
});

//? --------- instance method ----------------

// instance methode to increment viewedProfile
userSchema.methods.incrementViewedProfile = function () {
	this.viewedProfile += 1;
	return this.save();
};

// instance methode to increment Impressions
userSchema.methods.incrementImpressions = function () {
	this.impressions += 1;
	return this.save();
};

//? --------- Middlewares ----------------

//? --------- static methods ----------------

//? --------- virtual (set / get) methods ----------------
// accuss by user.fullName
userSchema.virtual("fullName").get(function () {
	return this.firstName + " " + this.lastName;
});

//? --------- validations methods ----------------

let User = mongoose.model("User", userSchema);

// User.SetAlgoliaSettings({
// 	searchableAttributes: [
// 		"name",
// 		"displayName",
// 		"job",
// 		"location",
// 		"profileId",
// 		"totalPosts",
// 		"impressions",
// 		"viewedProfile",
// 	], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
// });

module.exports = User;
