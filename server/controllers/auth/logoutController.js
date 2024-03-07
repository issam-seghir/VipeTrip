const User = require("@model/User");
const { getCookieOptions } = require("@config/cookieOptions");

const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");

const handleLogout = asyncWrapper(async (req, res) => {
	//! don't forget to clear the cookie on the client side (access token)
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
	res.clearCookie("jwt", getCookieOptions(foundUser.rememberMe));
	res.status(204).send();
});

module.exports = { handleLogout };
