// @ts-check
const { isProd } = require("@config/const.js");
const { ENV } = require("@/validations/envSchema");

const helmetOptions = {
	crossOriginResourcePolicy: {
		policy: isProd ? "same-origin" : "cross-origin", // fix laoding image in frontend
	},
};

module.exports = { helmetOptions };
