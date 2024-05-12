const jwt = require("jsonwebtoken");
const { ENV } = require("@/validations/envSchema");
const createError = require("http-errors");
const log = require("@/utils/chalkLogger");

const verifyJWT = (req, res, next) => {
	//* for web socket io auth
	const isHandshake = req?._query?.sid === undefined;
	if (!isHandshake) {
		console.log("isHandshake for socket io :", isHandshake);
		return next();
	}
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(new createError.Unauthorized("Missing or malformed Authorization header"));
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
		// Attach user data to request object
		// @ts-ignore
		req.user = { id: decoded.id };
		next();
	} catch (error) {
		log.error("verifyJWT middlware:\n", error);
		return next(new createError.Forbidden("Invalid or expired ACCESS_TOKEN "));
	}
};

module.exports = verifyJWT;
