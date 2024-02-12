// source : https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p

const { AnyZodObject } = require("zod");

/**
 * @typedef {Object} ExpressReq
 * @property {Object} body - The body of the request
 * @property {Object} query - The query parameters of the request
 * @property {Object} params - The route parameters of the request
 */

/**
 * @typedef {Object} ExpressRes
 * @property {function} status - Function to set the status code
 * @property {function} json - Function to send a JSON response
 */

/**
 * Middleware function to validate request data.
 * @param {AnyZodObject} schema - The Zod schema to validate the request data against.
 * @returns {Function} The Express middleware function.
 * @link https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p
 * @example
 * const { z } = require('zod');
 * const { validate } = require('./middleware/validate');
 * const { dataSchema } = require('./validations/registerValidation');
 *
 * app.post('/register', validate(dataSchema),yourController);
 */

const validate =
	(schema) =>
	/**
	 * Express middleware function.
	 * @param {ExpressReq} req - The Express request object.
	 * @param {ExpressRes} res - The Express response object.
	 * @param {function} next - The Express next function.
	 * @returns {Promise<void>} A Promise that resolves when the validation is done.
	 */
	async (req, res, next) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			return next();
		} catch (error) {
			return res.status(400).json(error);
		}
	};

module.exports = validate;
