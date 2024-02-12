// @ts-check
const jwt = require("jsonwebtoken");
const { ENV } = require("@/validations/envSchema");
const { Unauthorized, InternalServerError, Forbidden } = require("http-errors");
const log = require("@/utils/chalkLogger");

/**
 * Middleware function for Express that verifies the JWT token from the Authorization header.
 * If the token is valid, it attaches the user data to the request object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {import('express').Response | void} - Returns a response object if there's an error, otherwise returns nothing.
 */
const verifyJWT = (req, res, next) => {
	const authHeaders = [req.headers.authorization || req.headers.Authorization].flat();
	let token;

	for (let authHeader of authHeaders) {
		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
			break;
		}
	}

	if (!token) {
		return next(new Unauthorized("Missing or malformed Authorization header"));
	}

	if (!ENV.ACCESS_TOKEN_SECRET) {
		return next(new InternalServerError("Server error: JWT secret not defined"));
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		// Attach user data to request object
		// @ts-ignore
		req.user = { id: decoded.id };
		next();
	} catch (error) {
		log.error("JWT verification error:\n", error);
		return next(new Forbidden("Invalid or expired token"));
	}
};

module.exports = verifyJWT;
