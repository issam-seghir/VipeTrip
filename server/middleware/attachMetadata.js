// @ts-check

/**
 * @typedef {Object} Metadata
 * @property {number} time - The timestamp when the request was received.
 * @property {string} ip - The IP address of the client making the request.
 * @property {string} userAgent - The User-Agent header from the client's request.
 */

/**
 * @typedef {Object} RequestBody
 * @property {string} name - The name provided in the request body.
 * @property {number} age - The age provided in the request body.
 */

/**
 * @typedef {Object} RequestQuery
 * @property {string} name - The name provided in the request query.
 * @property {number} age - The age provided in the request query.
 */

/**
 * @typedef {import('express').Request<{}, any, RequestBody, RequestQuery> & { metadata: Metadata }} CustomRequest
 */

/**
 * Middleware function that attaches metadata to the request object.
 * The metadata includes the current time, client's IP address, and user agent.
 *
 * @param {CustomRequest} req - The Express Request object. This function adds a `metadata` property to this object.
 * @param {import('express').Response} res - The Express Response object. Not used in this function, but included for completeness.
 * @param {import('express').NextFunction} next - A callback function to pass control to the next middleware function in the stack.
 * @example
 * // Import the middleware
 * const attachMetadata = require("./middleware/attachMetadata");
 *
 * // Use the middleware
 * app.use(attachMetadata);
 *
 * // In a route handler, access the metadata on the request object
 * app.get("/", (req, res) => {
 *     console.log(req.metadata); // Logs the entire metadata object
 *     console.log('Request Time:', req.metadata.time); // Logs the request time
 *     console.log('Client  IP:', req.metadata.ip); // Logs the client's IP address
 *     console.log('User Agent:', req.metadata.userAgent); // Logs the user agent
 * });
 */

function attachMetadata(req, res, next) {
	req.metadata = {
		time: Date.now(),
		ip: req.ip,
		userAgent: req.headers["user-agent"],
	};

	next();
}

module.exports = attachMetadata;
