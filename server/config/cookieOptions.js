
const { isProd } = require("@config/const");

const cookieOptions = {
	httpOnly: true,
	secure: isProd,
	sameSite: isProd ? "strict" : "Lax",
	maxAge: Number(process.env.COOKIE_MAX_AGE),
};


module.exports = cookieOptions;
