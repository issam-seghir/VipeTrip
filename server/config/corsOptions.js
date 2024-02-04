const { whitelist } = require("@config/allowedOrigins.js");
const { isProd } = require("@config/const.js");

const corsOptions = {
	origin: function (origin, callback) {
		//? Allow requests with no origin (non-browser clients )
		//? (like mobile apps or curl requests / Thunder Client , Postman etc)
		if (!origin && !isProd) return callback(null, true);
		if (whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, // this allows the session cookie to be sent back and forth
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = { corsOptions };
