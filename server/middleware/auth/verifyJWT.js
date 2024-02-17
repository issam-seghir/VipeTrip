// @ts-check
const jwt = require("jsonwebtoken");
const { ENV } = require("@/validations/envSchema");
const { Unauthorized, InternalServerError, Forbidden } = require("http-errors");
const log = require("@/utils/chalkLogger");

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
