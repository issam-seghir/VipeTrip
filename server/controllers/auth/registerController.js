const User = require("@model/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");

const handleNewUser = asyncWrapper(async (req, res, next) => {
	console.log(req.body);
	// const { firstName, lastName, email, password, job, location } = req.body;
	// const picturePath = req?.file?.path || ""; // Get picturePath from req.file

	// // check for duplicate usernames in the db
	// const duplicate = await User.findOne({ email });
	// if (duplicate) return next(createError(400, "Email already in use")); //Conflict

	// //create and store the new user
	// const user = await User.create({
	// 	firstName,
	// 	lastName,
	// 	email,
	// 	password : bcrypt.hashSync(password, 10),
	// 	picturePath,
	// 	job,
	// 	location,
	// });

	// // Save user
	// await user.save();

	// res.status(201).json({ success: `New user ${firstName + "-" + lastName} created!`, user: user });
});

module.exports = { handleNewUser };
