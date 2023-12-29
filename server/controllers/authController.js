const User = require("@model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const foundUser = await User.findOne({ email }).exec();
		if (!foundUser) return res.status(404).send("User not found");
		// evaluate password
		const match = await bcrypt.compare(password, foundUser.password);
		if (!match) return res.status(401).send("Incorrect password");

		if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
			return res.status(500).send("Server error: JWT secrets not defined");
		}
		// create JWTs
		const accessToken = jwt.sign(
			{
				id: foundUser._id.toString(),
				email: foundUser.email,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "1h" }
		);
		const refreshToken = jwt.sign({ email: foundUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
		// Saving refreshToken with current user
		foundUser.refreshToken = refreshToken;
		await foundUser.save();

		// Creates Secure Cookie with refresh token
		res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
		// Send authorization roles and access token to user
		res.json({ accessToken });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
};

module.exports = { handleLogin };
