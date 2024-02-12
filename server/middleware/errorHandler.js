const log = require("@/utils/chalkLogger");
/**
 * Error-handling middleware function for Express. Catches any errors passed to the `next` function and sends a response with a 500 status code.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */

const errorHandler = (err, req, res, next) => {
	log.error("Server Error", "🧨🧨🧨");
	console.error(err.stack);
	res.status(500).send(err.message);
};

module.exports = errorHandler;
