const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, "firstName is required"],
			minlength: [3, "firstName must be at least 3 characters , got {VALUE}"],
			maxlength: [50, "firstName must be at most 50 characters , got {VALUE}"],
			alias: "fname",
		},
		lastName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
			alias: "lname",
		},
		email: {
			type: String,
			required: true,
			// minlength: 7,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			alias: "pswd",
		},
		picturePath: {
			type: String,
			default: "",
			alias: "picPath",
		},
		coverPath: {
			type: String,
			default: "",
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
		refreshToken: String,
	},
	{
		timestamps: true,
	}
);

//? --------- instance method ----------------

//* toJSON / toObject Transform method
// transform user object before sending it in response with toObject()
userSchema.methods.transform = function () {
	const obj = this.toObject();
	delete obj.password;
	delete obj.email;
	return obj;
};

// transform user object before sending it in response with toJSON()

userSchema.methods.transform = function () {
	const json = this.toJSON();
	delete json.password;
	delete json.email;
	return json;
};

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

userSchema.path("email").validate(function (v) {
	// Simple regex for email validation
	const regex = /^\S+@\S+\.\S+$/;
	return regex.test(v);
}, "{VALUE} is not a valid email!");

userSchema.path("password").validate(function (v) {
	// Regular expression that checks for the rules
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z])(?=.*[!#$%&*@^]).{8,}$/;
	return regex.test(v);
}, "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character");

module.exports = mongoose.model("User", userSchema);
