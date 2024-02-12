// @ts-check

const express = require("express");
const mongoose = require("mongoose");
const { RateLimiterMongo } = require("rate-limiter-flexible");
const log = require("@/utils/chalkLogger");
const createError = require("http-errors");

const mongoConn = mongoose.connection;

const options = new RateLimiterMongo({
	storeClient: mongoConn,
	keyPrefix: "middleware",
	points: 10, // 10 requests
	duration: 1, // per 1 second by IP
	tableName: "rate_limits", // Name of the collection to use for storing rate limit data
});

/**
 * Middleware function for limiting the rate of requests.
 * If the rate limit is exceeded, it sends a response with a status of 429 and a message "Too Many Requests".
 * Otherwise, it passes the request to the next middleware.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next function.
 * @returns {void} - A void return type since the function doesn't return a value.
 */
const rateLimiterMiddleware = (req, res, next) => {
	options
		.consume(req.ip) // Consume 1 point for each request
		.then((rateLimiterRes) => {
			res.setHeader("Retry-After", rateLimiterRes.msBeforeNext / 1000);
			res.setHeader("X-RateLimit-Limit", options.points);
			res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
			res.setHeader("X-RateLimit-Reset", new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

			next();
		})
		.catch((error) => {
			res.setHeader("Retry-After", error.msBeforeNext / 1000);
			res.setHeader("X-RateLimit-Limit", options.points);
			res.setHeader("X-RateLimit-Remaining", error.remainingPoints);
			res.setHeader("X-RateLimit-Reset", new Date(Date.now() + error.msBeforeNext).toISOString());

			log.error("rate-limiter-flexible : ", "Too Many Requests");
			throw createError.TooManyRequests("Too Many Requests");
		});
};

module.exports = rateLimiterMiddleware;
