const { ENV } = require("@/validations/envSchema");

const isProd = ENV.NODE_ENV === "production";
const isDev = ENV.NODE_ENV === "development";

console.log("the mode is in const.js", ENV.NODE_ENV);

const readyStates = new Map([
	[0, "disconnected"],
	[1, "connected"],
	[2, "connecting"],
	[3, "disconnecting"],
	[4, "uninitialized"],
]);

module.exports = {
	isProd,
	isDev,
	readyStates,
};
