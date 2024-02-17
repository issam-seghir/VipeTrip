// @ts-check

const express = require("express");
const mongoose = require("mongoose");
const { RateLimiterMongo, RateLimiterRes } = require("rate-limiter-flexible");
const log = require("@/utils/chalkLogger");
const createError = require("http-errors");
const { ENV } = require("@/validations/envSchema");
const {mongo_ratelimit} = require("@config/dbConn")

/* //* Storage options:
	//* Memory : https://github.com/animir/node-rate-limiter-flexible/wiki/Memory
	//* Memory Cash : https://github.com/animir/node-rate-limiter-flexible/wiki/Memcache

//* All possible methods here :
	//* https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#minimal-protection-against-password-brute-force
	//* https://medium.com/@animirr/brute-force-protection-node-js-examples-cd58e8bd9b8d#e516
*/

const mongoConn = mongoose.connection;

var ratelimiter = async () => {
	await mongo_ratelimit; //since this is a promise, we wait for it to become resolved
	return new RateLimiterMongo({
		storeClient: mongoConn,
		dbName: ENV.DATABASE_NAME,
		keyPrefix: "middleware",
		points: 10, // 10 requests
		duration: 1, // per 1 second by IP
		tableName: "rate_limits", // Name of the collection to use for storing rate limit data
	});
};


const rateLimiterMiddleware = async (req, res, next) => {
	let ratelimiterOptions;
	try {
		ratelimiterOptions = await ratelimiter();
		const rateLimiterRes = await ratelimiterOptions.consume(req.ip); // Consume 1 point for each request
		log.debug("RateLimit-Limit Response .....");
		console.log(rateLimiterRes);
		res.setHeader("Retry-After", rateLimiterRes.msBeforeNext / 1000);
		res.setHeader("X-RateLimit-Limit", ratelimiterOptions.points);
		res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
		res.setHeader("X-RateLimit-Reset", new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

		next();
		// eslint-disable-next-line unicorn/catch-error-name
	} catch (rateLimiterRes) {
		if (rateLimiterRes instanceof RateLimiterRes) {
			log.warning("RateLimit-Limit Error .....");
			console.log(rateLimiterRes);

			res.setHeader("Retry-After", rateLimiterRes.msBeforeNext / 1000);
			res.setHeader("X-RateLimit-Limit", ratelimiterOptions.points);
			res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
			res.setHeader("X-RateLimit-Reset", new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

			log.error("rate-limiter-flexible : ", "Too Many Requests");
			res.status(429).send("Too Many Requests");
		} else {
			// Handle other types of errors
			console.error(rateLimiterRes);
			res.status(500).send("Internal Server Error");
		}
	}
};

module.exports = rateLimiterMiddleware;
