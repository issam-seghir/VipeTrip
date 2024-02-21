const log = require("@/utils/chalkLogger");
const errorNotification = require("@config/notifier");
const { isDev } = require("@config/const");

const errorHandler = (err, req, res, next) => {
	// Use the status property of the error, or default to 500
	const statusCode = err.status || 500;

	log.error("Error", "🧨");
	console.error(err.stack);
	isDev && errorNotification(err, req);
	// Set the response status code to the error status code
	// Only send the error message to the client in development environment
	const message = isDev ? err.message : statusCode >= 500 ? "Internal Server Error" : "An error occurred";
	res.status(statusCode).send(message);
};

module.exports = errorHandler;
