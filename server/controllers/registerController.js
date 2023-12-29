const User = require('@model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { firstName, lastName, email, password, picturePath, occupation, location, friends } = req.body;

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPass = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPass,
			picturePath,
			occupation,
			location,
			friends,
		});
        res.status(201).json({ success: `New user ${firstName + "" + lastName} created!` ,userInfo: result});
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { handleNewUser };
