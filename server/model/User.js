const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		lastName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
			validate: {
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
			validate: {
				validator: function (v) {
					// Regular expression that checks for the rules
					const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z])(?=.*[!#$%&*@^]).{8,}$/;
					return regex.test(v);
				},
				message: (props) => `Password should have at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character`,
			},
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
		occupation: String,
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
