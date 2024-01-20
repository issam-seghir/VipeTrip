
const { isProduction } = require("@config/const");

const cookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? "strict" : "Lax",
	maxAge: Number(process.env.COOKIE_MAX_AGE),
};


module.exports = cookieOptions;
