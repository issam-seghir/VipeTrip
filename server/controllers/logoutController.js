const User = require("@model/User");
const { isProduction } = require("@config/const");

const handleLogout = async (req, res) => {
	//! don't forget to clear the cookie on the client side (access token)
	try {
		const cookies = req.cookies;
		if (!cookies?.jwt) {
			return res.status(204).send(); // No content
		}
		const refreshToken = cookies.jwt;

		// Check if refreshToken exists in the database
		const foundUser = await User.findOne({ refreshToken });
		if (!foundUser) {
			res.clearCookie("jwt", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "strict" : "None", maxAge: 24 * 60 * 60 * 1000 });
			return res.status(204).send();
		}

		// Delete refreshToken in the database
		foundUser.refreshToken = "";
		const result = await foundUser.save();
		console.log(result);

		res.clearCookie("jwt", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "strict" : "None", maxAge: 24 * 60 * 60 * 1000 });
		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};

module.exports = { handleLogout };
