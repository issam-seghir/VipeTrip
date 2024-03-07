const User = require("@model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isProd } = require("@config/const");
const {getCookieOptions} = require("@config/cookieOptions");
const { ENV } = require("@/validations/envSchema");

const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");

/**
 * @typedef {import('@validations/authSchema').LoginBody} LoginBody
 */

const handleLogin = asyncWrapper(async (req, res, next) => {
	/** @type {LoginBody} */
	const { email, password, rememberMe } = req.body;

	// verifie user existence in database
	const foundUser = await User.findOne({ email });
	if (!foundUser) return res.status(404).json({ field: "email", message: "User not found" });

	// evaluate password
	const match = await bcrypt.compare(password, foundUser.password);
	if (!match) return res.status(401).json({ field: "password", message: "Incorrect password" }); //Unauthorized

	// create JWT Refresh Token
	const newRefreshToken = jwt.sign(
		{
			id: foundUser._id.toString(),
			email: foundUser.email,
		},
		ENV.REFRESH_TOKEN_SECRET,
		{ expiresIn: rememberMe ? ENV.REFRESH_TOKEN_SECRET_EXPIRE_REMEMBER_ME : ENV.REFRESH_TOKEN_SECRET_EXPIRE }
	);

	// Saving refreshToken with current user in database
	foundUser.refreshToken = newRefreshToken;
	foundUser.rememberMe = rememberMe;
	await foundUser.save();

	// Creates Secure Cookie with refresh token
	//? Use the httpOnly flag to prevent JavaScript from reading it.
	//? Use the secure=true flag so it can only be sent over HTTPS.
	//? Use the SameSite=strict flag whenever possible to prevent CSRF. This can only be used if the Authorization Server has the same site as your front-end.
	res.cookie("jwt", newRefreshToken, getCookieOptions(rememberMe));

	// Create JWT Access Token
	const accessToken = jwt.sign(
		{
			id: foundUser._id.toString(),
			email: foundUser.email,
		},
		ENV.ACCESS_TOKEN_SECRET,
		{ expiresIn: rememberMe ? ENV.ACCESS_TOKEN_SECRET_EXPIRE_REMEMBER_ME : ENV.ACCESS_TOKEN_SECRET_EXPIRE }
	);

	// Send authorization roles and access token to user
	res.json({ success: `Login : ${foundUser.fullName}!`, token: accessToken, user: foundUser });
});

const checkEmailExists = asyncWrapper(async (req, res, next) => {
	const { email } = req.query;
	// verifie user existence in database
	const foundUser = await User.findOne({ email });
	res.json({ invalid: !foundUser });
});

module.exports = { handleLogin, checkEmailExists };
