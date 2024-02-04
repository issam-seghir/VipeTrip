const User = require("@model/User");
const { isProd } = require("@config/const");
const cookieOptions = require("@config/cookieOptions");

const handleLogout = async (req, res) => {
	//! don't forget to clear the cookie on the client side (access token)
	try {
		const { jwt: refreshToken } = req.cookies;

		// Check if refreshToken exists in the cookie
		if (!refreshToken) {
			return res.status(204).json(); // No content
		}

		// Check if refreshToken exists in the database
		const foundUser = await User.findOne({ refreshToken });
		if (foundUser) {
			// Delete refreshToken in the database
			foundUser.refreshToken = "";
			await foundUser.save();
		}


		// Clear refreshToken from cookies
		res.clearCookie("jwt", cookieOptions);
		res.status(204).send();

	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

module.exports = { handleLogout };
