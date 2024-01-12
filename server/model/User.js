const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			minlength: 7,
			unique: true,
			validate: {
				//!  Validation will only run when create or save (so is not working with methods like findOneAndUpdate , findOneAndDelete , etc.)
				validator: function (v) {
					// Simple regex for email validation
					const regex = /^\S+@\S+\.\S+$/;
					return regex.test(v);
				},
				message: (props) => `${props.value} is not a valid email!`,
			},
		},
		password: {
			type: String,
			required: true,
			// validate: {
			// 	validator: function (v) {
			// 		// Regular expression that checks for the rules
			// 		const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z])(?=.*[!#$%&*@^]).{8,}$/;
			// 		return regex.test(v);
			// 	},
			// 	message: (props) => `Password should have at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character`,
			// },
		},
		picturePath: {
			type: String,
			default: "",
		},
		friends: [
			{
				type: Schema.Types.ObjectId,
				default: [],
				ref: "User",
			},
		],
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
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
