const { whitelist, isProduction } = require("@config/allowedOrigins");

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (whitelist.includes(origin) || (!isProduction && !origin)) {
		res.header("Access-Control-Allow-Credentials", true);
	}
	next();
};

module.exports = credentials;
