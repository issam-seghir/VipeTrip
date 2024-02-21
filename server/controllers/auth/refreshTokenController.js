const User = require("@model/User");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const log = require("@/utils/chalkLogger");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const { ENV } = require("@/validations/envSchema");

const handleRefreshToken = asyncWrapper(async (req, res, next) => {
	log.info("refrech token ...");
	const { jwt: refreshToken } = req.cookies;

	if (!refreshToken) {
		return next(createError.Unauthorized("No token provided"));
	}

	const foundUser = await User.findOne({ refreshToken });
	if (!foundUser) return next(createError.Forbidden("Invalid refresh token"));

	// Verify the refresh token
	jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET, async (err, decoded) => {
		if (err || foundUser.email !== decoded.email || foundUser.id !== decoded.id) return next(createError.Forbidden("Token verification failed"));

		// If the verification is successful, create a new access token
		const accessToken = jwt.sign(
			{
				id: decoded.id,
				email: decoded.email,
			},
			ENV.ACCESS_TOKEN_SECRET,
			{ expiresIn: ENV.ACCESS_TOKEN_SECRET_EXPIRE }
		);

		res.json({ token: accessToken });
	});
});

module.exports = { handleRefreshToken };
