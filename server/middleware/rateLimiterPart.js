/* Different limits for different parts of application
This can be achieved by creating of independent limiters. */


const express = require("express");
const Redis = require("ioredis");
const redisClient = new Redis({ enableOfflineQueue: false });

const app = express();

const rateLimiterRedis = new RateLimiterRedis({
	storeClient: redisClient,
	points: 300, // Number of points
	duration: 60, // Per 60 seconds
});

const rateLimiterRedisReports = new RateLimiterRedis({
	keyPrefix: "rlreports",
	storeClient: redisClient,
	points: 10, // Only 10 points for reports per user
	duration: 60, // Per 60 seconds
});

// req.userId should be set by someAuthMiddleware. It is up to you, how to do that
app.use(someAuthMiddleware);

const rateLimiterMiddleware = (req, res, next) => {
	const key = req.userId ? req.userId : req.ip;
	if (req.path.indexOf("/report") === 0) {
		const pointsToConsume = req.userId ? 1 : 5;
		rateLimiterRedisReports
			.consume(key, pointsToConsume)
			.then(() => {
				next();
			})
			.catch((_) => {
				res.status(429).send("Too Many Requests");
			});
	} else {
		const pointsToConsume = req.userId ? 1 : 30;
		rateLimiterRedis
			.consume(key, pointsToConsume)
			.then(() => {
				next();
			})
			.catch((_) => {
				res.status(429).send("Too Many Requests");
			});
	}
};
app.use(rateLimiterMiddleware);
