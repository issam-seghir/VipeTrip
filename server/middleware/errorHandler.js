const log = require("@/utils/chalkLogger");
const errorNotification = require("@config/notifier");


const errorHandler = (err, req, res, next) => {
	// Use the status property of the error, or default to 500
	const statusCode = err.status || 500;

	log.error("Error", "🧨");
	console.error(err.stack);
	errorNotification(err, req);
	// Set the response status code to the error status code
	res.status(statusCode).send(err.message);
};

module.exports = errorHandler;
