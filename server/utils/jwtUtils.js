const jwt = require("jsonwebtoken");
const User = require("@model/User");
const createError = require("http-errors");
const { ENV } = require("@/validations/envSchema");

const createToken = (user, secret, expiresIn) => {
	const { id, email } = user;
	return jwt.sign({ id, email }, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decodedPayload) => {
			if (err) {
				return reject(createError.Unauthorized("Token verification failed"));
			}
			resolve(decodedPayload);
		});
	});
};

const refreshToken = async (refreshToken) => {
	const decodedPayload = await verifyToken(refreshToken, ENV.REFRESH_TOKEN_SECRET);
	const user = await User.findOne({ _id: decodedPayload.id, refreshToken });

	if (!user) {
		throw createError.Unauthorized("Invalid refresh token");
	}

	const newAccessToken = createToken(user, ENV.ACCESS_TOKEN_SECRET, ENV.ACCESS_TOKEN_SECRET_EXPIRE);
	const newRefreshToken = createToken(user, ENV.REFRESH_TOKEN_SECRET, ENV.REFRESH_TOKEN_SECRET_EXPIRE);

	user.refreshToken = newRefreshToken;
	await user.save();

	return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

module.exports = { createToken, verifyToken, refreshToken };
