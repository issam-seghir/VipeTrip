const mongoose = require("mongoose");
const { normalize } = require("@utils/plugins");
const mongooseAlgolia = require("@issam-seghir/mongoose-algolia").algoliaIntegration;
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
		Postimpressions: {
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
	selector: "-password -email -rememberMe -socialAccounts.accessToken -refreshToken", //  You can decide which field that are getting synced to Algolia (same as selector in mongoose)
	// If you want to prevent some documents from being synced to algolia
	// },
	// filter: function (doc) {
	// 	return !doc.softdelete;
	// },
	debug: true, //  logged out in your console
});

//? --------- instance method ----------------

// instance methode to increment viewedProfile
userSchema.methods.incrementViewedProfile = function () {
	this.viewedProfile += 1;
	return this.save();
};

// instance methode to increment Postimpressions
userSchema.methods.incrementPostimpressions = function () {
	this.Postimpressions += 1;
	return this.save();
};

//? --------- Middlewares ----------------

//? --------- static methods ----------------

//? --------- virtual (set / get) methods ----------------
// accuss by user.fullName
userSchema.virtual("fullName").get(function () {
	return this.firstName + " " + this.lastName;
});

let User = mongoose.model("User", userSchema);

User.syncToAlgolia()
	.then(() => {
		console.log("All users have been synced to Algolia");
	})
	.catch((error) => {
		console.error("Error syncing users to Algolia", error);
	});

// User.SetAlgoliaSettings({
// 	searchableAttributes: [
//	...
// 	], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
// });

module.exports = User;
