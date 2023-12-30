
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
	isProduction,
	isDevelopment,
};
