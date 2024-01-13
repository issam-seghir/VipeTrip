const User = require("@model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(401).json({ message: "No token provided" }); // Unauthorized
	const refreshToken = cookies.jwt;

	try {
		const foundUser = await User.findOne({ refreshToken });

		if (!foundUser) return res.status(403).json({ message: "Invalid refresh token" }); // Forbidden

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
			if (err || foundUser.email !== decoded.email || foundUser.id !== decoded.id) return res.status(403).json({ message: "Token verification failed" });


			const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE });

			res.json({ accessToken });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" }); // Internal Server Error
	}
};

module.exports = { handleRefreshToken };
