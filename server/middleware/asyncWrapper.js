// @ts-check

/**
 * Wraps an asynchronous Express middleware function and passes any errors to the next middleware.
 * @param {function} fn - The asynchronous middleware function to wrap.
 * @returns {function} - The wrapped middleware function.
 * @example
 * app.get('/route', asyncWrapper(async (req, res, next) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 *
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => Promise<void>} AsyncMiddleware
 *
 * @type {(fn: AsyncMiddleware) => (req: Request, res: Response, next: NextFunction) => void}
 */
function asyncWrapper(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch(next);
	};
}

module.exports = {asyncWrapper};
