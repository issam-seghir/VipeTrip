const express = require("express");
const mongoose = require("mongoose");
const { RateLimiterMongo } = require("rate-limiter-flexible");

const mongoConn = mongoose.connection;

const options = new RateLimiterMongo({
	storeClient: mongoConn,
	keyPrefix: "middleware",
	points: 10, // 10 requests
	duration: 1, // per 1 second by IP
	tableName: "rate_limits", // Name of the collection to use for storing rate limit data
});

let resetDate;
const rateLimiterMiddleware = (req, res, next) => {
	options
		.consume(req.ip) // Consume 1 point for each request
		.then((rateLimiterRes) => {
			res.setHeader("X-RateLimit-Limit", options.points);
			res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
			res.setHeader("X-RateLimit-Reset", resetDate);
			next();
		})
		.catch((error) => {
			resetDate = new Date(Date.now() + error.msBeforeNext);
			res.setHeader("Retry-After", error.msBeforeNext / 1000);
			res.setHeader("X-RateLimit-Limit", options.points);
			res.setHeader("X-RateLimit-Remaining", error.remainingPoints);
			res.setHeader("X-RateLimit-Reset", resetDate);
			res.status(429).send("Too Many Requests");
		});
};

module.exports = rateLimiterMiddleware;
