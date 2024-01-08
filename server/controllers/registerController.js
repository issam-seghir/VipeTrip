const User = require('@model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { firstName, lastName, email, password, picture, job, location, friends } = req.body;
console.log(req.body);
	try {
		// check for duplicate usernames in the db
		const duplicate = await User.findOne({ email });
		if (duplicate) return res.status(409).json({ message: "Email already in use" }); //Conflict

		//create and store the new user
		const user = await User.create({
			firstName,
			lastName,
			email,
			password, //  Don't hash the password yet for validation
			picture,
			job,
			location,
			friends,
		});

		// Validate user
		const validationError = user.validateSync();
		if (validationError) {
			return res.status(400).json({ message: validationError.message });
		}

		//encrypt the password
		user.password = await bcrypt.hash(password, 10);
		// Save user
		await user.save();

		res.status(201).json({ success: `New user ${firstName + "-" + lastName} created!`, userInfo: user });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

module.exports = { handleNewUser };
