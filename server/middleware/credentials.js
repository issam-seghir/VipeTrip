// @ts-check

const { ENV } = require("@/validations/envSchema");

/**
 * Middleware function for Express that sets the "Access-Control-Allow-Credentials" header if the request's origin is in the list of allowed origins.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (ENV.ALLOWED_ORIGINS.includes(origin)) {
		res.header("Access-Control-Allow-Credentials", "true");
	}
	next();
};

module.exports = credentials;
