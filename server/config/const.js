const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const readyStates = new Map([
	[0, "disconnected"],
	[1, "connected"],
	[2, "connecting"],
	[3, "disconnecting"],
	[4, "uninitialized"],
]);


module.exports = {
	isProduction,
	isDevelopment,
	readyStates,
};
