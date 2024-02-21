// @ts-check
const User = require("@model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isProd } = require("@config/const");
const cookieOptions = require("@config/cookieOptions");
const { ENV } = require("@/validations/envSchema");

const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");

/**
 * @typedef {import('@validations/authSchema').LoginBody} LoginBody
 */

const handleLogin = asyncWrapper(async (req, res, next) => {
	/** @type {LoginBody} */
	const { email, password } = req.body;

	// verifie user existence in database
	const foundUser = await User.findOne({ email });
	if (!foundUser) return next(createError.NotFound("User not found"));

	// evaluate password
	// @ts-ignore
	const match = await bcrypt.compare(password, foundUser.password);
	if (!match) return next(createError.Unauthorized("Incorrect password"));

	// create JWT Refresh Token
	const newRefreshToken = jwt.sign(
		{
			id: foundUser._id.toString(),
			// @ts-ignore
			email: foundUser.email,
		},
		ENV.REFRESH_TOKEN_SECRET,
		{ expiresIn: ENV.REFRESH_TOKEN_SECRET_EXPIRE }
	);

	// Saving refreshToken with current user in database
	// @ts-ignore
	foundUser.refreshToken = newRefreshToken;
	await foundUser.save();

	// Creates Secure Cookie with refresh token
	//? Use the httpOnly flag to prevent JavaScript from reading it.
	//? Use the secure=true flag so it can only be sent over HTTPS.
	//? Use the SameSite=strict flag whenever possible to prevent CSRF. This can only be used if the Authorization Server has the same site as your front-end.
	// @ts-ignore
	res.cookie("jwt", newRefreshToken, cookieOptions);

	// Create JWT Access Token
	const accessToken = jwt.sign(
		{
			id: foundUser._id.toString(),
			// @ts-ignore
			email: foundUser.email,
		},
		ENV.ACCESS_TOKEN_SECRET,
		{ expiresIn: ENV.ACCESS_TOKEN_SECRET_EXPIRE }
	);

	// Send authorization roles and access token to user
	// @ts-ignore
	res.json({ success: `Login : ${foundUser.fullName}!`, token: accessToken, user: foundUser });
});

module.exports = { handleLogin };
