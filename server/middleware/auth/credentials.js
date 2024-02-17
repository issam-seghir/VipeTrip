// @ts-check

const { ENV } = require("@/validations/envSchema");

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (ENV.ALLOWED_ORIGINS.includes(origin)) {
		res.header("Access-Control-Allow-Credentials", "true");
	}
	next();
};

module.exports = credentials;
