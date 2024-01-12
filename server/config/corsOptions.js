const whitelist = require("@config/allowedOrigins.js");
const { isProduction } = require("@config/const.js");

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.includes(origin) || (!isProduction && !origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, // this allows the session cookie to be sent back and forth
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = { corsOptions };
