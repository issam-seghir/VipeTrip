const User = require("@model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {isProduction} = require("@config/const");

const handleLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const foundUser = await User.findOne({ email });
		if (!foundUser) return res.status(404).send({ message: "User not found"});
		// evaluate password
		const match = await bcrypt.compare(password, foundUser.password);
		if (!match) return res.status(401).send( {message: "Incorrect password"});

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
			{ expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE }
		);
		const refreshToken = jwt.sign({ id: foundUser._id.toString(), email: foundUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE });
		// Saving refreshToken with current user
		foundUser.refreshToken = refreshToken;
		await foundUser.save();

		// Creates Secure Cookie with refresh token
		//? Use the httpOnly flag to prevent JavaScript from reading it.
		//? Use the secure=true flag so it can only be sent over HTTPS.
		//? Use the SameSite=strict flag whenever possible to prevent CSRF. This can only be used if the Authorization Server has the same site as your front-end.
		console.log("isProduction:",isProduction);
		res.cookie("jwt", refreshToken, { httpOnly: true, secure: isProduction, sameSite: isProduction ? "strict" : "None", maxAge: Number(process.env.COOKIE_MAX_AGE) });
		// Send authorization roles and access token to user
		res.json({ token:accessToken, user : foundUser });
	} catch (error) {
		
		console.error(error);
		res.status(500).send("Server error");
	}
};

module.exports = { handleLogin };
