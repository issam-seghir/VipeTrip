// @ts-check

const express = require("express");
const mongoose = require("mongoose");
const { RateLimiterMongo } = require("rate-limiter-flexible");
const log = require("@/utils/chalkLogger");
const createError = require("http-errors");
const { ENV } = require("@/validations/envSchema");

/* //* Storage options:
	//* Memory : https://github.com/animir/node-rate-limiter-flexible/wiki/Memory
	//* Memory Cash : https://github.com/animir/node-rate-limiter-flexible/wiki/Memcache

//* All possible methods here :
	//* https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#minimal-protection-against-password-brute-force
	//* https://medium.com/@animirr/brute-force-protection-node-js-examples-cd58e8bd9b8d#e516
*/

const mongoConn = mongoose.connection;

const options = new RateLimiterMongo({
	storeClient: mongoConn,
	dbName: ENV.DATABASE_NAME,
	keyPrefix: "middleware",
	points: 2, // 10 requests
	duration: 1, // per 1 second by IP
	tableName: "rate_limits", // Name of the collection to use for storing rate limit data
});



const rateLimiterMiddleware = (req, res, next) => {
	options
		.consume(req.ip) // Consume 1 point for each request
		.then((rateLimiterRes) => {
			log.debug("RateLimit-Limit Response .....");
			console.log(rateLimiterRes);
			res.setHeader("Retry-After", rateLimiterRes.msBeforeNext / 1000);
			res.setHeader("X-RateLimit-Limit", options.points);
			res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
			res.setHeader("X-RateLimit-Reset", new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

			next();
		})
		.catch((rateLimiterRes) => {
			log.warning("RateLimit-Limit Error .....");
			console.log(rateLimiterRes);

			res.setHeader("Retry-After", rateLimiterRes.msBeforeNext / 1000);
			res.setHeader("X-RateLimit-Limit", options.points);
			res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints );
			res.setHeader("X-RateLimit-Reset", new Date(Date.now() + (rateLimiterRes.msBeforeNext)).toISOString());

			log.error("rate-limiter-flexible : ", "Too Many Requests");
			res.status(429).send("Too Many Requests"); // Respond with 429 status code and message
		});
};

module.exports = rateLimiterMiddleware;
