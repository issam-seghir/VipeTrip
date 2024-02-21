const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, "firstName is required"],
		},
		lastName: {
			type: String,
			required: [true, "lastName is required"],
		},
		email: {
			type: String,
			required: [true, "email is required"],
			private: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, "password is required"],
			private: true,
		},
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

//? --------- instance method ----------------

//* toJSON / toObject Transform method
// transform user object before sending it in response with toObject()
// userSchema.methods.transform = function () {
// 	const obj = this.toObject();
// 	delete obj._id;
// 	delete obj.password;
// 	delete obj.email;
// 	delete obj.refreshToken;
// 	delete obj.__v;
// 	return obj;
// };

// transform user object before sending it in response with toJSON()

// userSchema.methods.transform = function () {
// 	const json = this.toJSON();
// 	delete json._id;
// 	delete json.password;
// 	delete json.email;
// 	delete json.refreshToken;
// 	delete json.__v;
// 	return json;
// };

// userSchema.set("toJSON", {
// 	virtuals: true,
// });

// userSchema.set("toObject", {
// 	virtuals: true,
// });

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

module.exports = mongoose.model("User", userSchema);
