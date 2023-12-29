const whitelist = require("./allowedOrigins.js");
const { isProduction } = require("./const.js");

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.includes(origin) || (!isProduction && !origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = { corsOptions};
