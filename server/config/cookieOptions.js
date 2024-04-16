// @ts-check

const { isProd } = require("@config/const");
const { ENV } = require("@/validations/envSchema");

const getCookieOptions = (rememberMe = true ,httpOnly=true) => ({
	httpOnly,
	secure: isProd,
	sameSite: isProd ? "strict" : "Lax",
	maxAge: rememberMe ? ENV.COOKIE_MAX_AGE_REMEMBER_ME : ENV.COOKIE_MAX_AGE,
});

module.exports = {getCookieOptions};
