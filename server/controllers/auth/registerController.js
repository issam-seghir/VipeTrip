const User = require("@model/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { asyncWrapper } = require("@middleware/asyncWrapper");

const handleNewUser = asyncWrapper(async (req, res, next) => {
	const { firstName, lastName, email, password, job, location, friends } = req.body;
	const picturePath = req?.file?.path || ""; // Get picturePath from req.file
	// check for duplicate usernames in the db
	const duplicate = await User.findOne({ email });
	if (duplicate) return res.status(409).send({ message: "Email already in use" }); //Conflict

	//create and store the new user
	const user = await User.create({
		firstName,
		lastName,
		email,
		password, //  Don't hash the password yet for validation
		picturePath,
		job,
		location,
		friends,
	});

	//encrypt the password
	user.password = await bcrypt.hash(password, 10);
	// Save user
	await user.save();

	res.status(201).json({ success: `New user ${firstName + "-" + lastName} created!`, user: user });
});

module.exports = { handleNewUser };
