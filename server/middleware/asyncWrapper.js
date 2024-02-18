

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @description Wrap asynchronous functions.
 * @param {function(Request, Response, NextFunction): Promise<any>} fn
 * @returns {function(Request, Response, NextFunction): Promise<any>}
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    const fnReturn = fn(req, res, next);
    return Promise.resolve(fnReturn).catch(next);
  };
};

module.exports = { asyncWrapper };
