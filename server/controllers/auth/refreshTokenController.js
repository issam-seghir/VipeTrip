const User = require("@model/User");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const handleRefreshToken = async (req, res) => {
	console.log("hello im refrech");
	const { jwt: refreshToken } = req.cookies;

	if (!refreshToken) {
		return res.status(401).json({ message: "No token provided" }); // Unauthorized;
	}

	try {
		const foundUser = await User.findOne({ refreshToken });
		if (!foundUser) return res.status(403).json({ message: "Invalid refresh token" }); // Forbidden

		// Verify the refresh token
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
			if (err || foundUser.email !== decoded.email || foundUser.id !== decoded.id) return res.status(403).json({ message: "Token verification failed" });

			// If the verification is successful, create a new access token
			const accessToken = jwt.sign(
				{
					id: decoded.id,
					email: decoded.email,
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE }
			);

			res.json({ token: accessToken });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" }); // Internal Server Error
	}
};

module.exports = { handleRefreshToken };
