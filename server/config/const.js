const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

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
