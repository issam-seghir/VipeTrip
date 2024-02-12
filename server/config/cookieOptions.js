// @ts-check

const { isProd } = require("@config/const");
const { ENV } = require("@/validations/envSchema");

const cookieOptions = {
	httpOnly: true,
	secure: isProd,
	sameSite: isProd ? "strict" : "Lax",
	maxAge: ENV.COOKIE_MAX_AGE,
};

module.exports = cookieOptions;
