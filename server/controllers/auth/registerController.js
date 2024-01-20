const User = require('@model/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const handleNewUser = async (req, res) => {
	const { firstName, lastName, email, password, job, location, friends } = req.body;
	const picturePath = req?.file?.path || ""; // Get picturePath from req.file
	// console.log(req.body);
	// console.log(req.file);
	try {
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
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(400).json({ message: error.message });
		} else {
			res.status(500).json({ message: "Something went wrong" });
		}
	}
}

module.exports = { handleNewUser };
