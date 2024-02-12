/* Authorized and not authorized users
Sometimes it is reasonable to make the difference between authorized and not authorized requests.
For example, an application must provide public access
as well as serve for registered and authorized users with different limits.
*/

const express = require("express");
const Redis = require("ioredis");

const redisClient = new Redis({ enableOfflineQueue: false });

const app = express();

const rateLimiterRedis = new RateLimiterRedis({
	storeClient: redisClient,
	points: 300, // Number of points
	duration: 60, // Per 60 seconds
});

// req.userId should be set by someAuthMiddleware. It is up to you, how to do that
app.use(someAuthMiddleware);

const rateLimiterMiddleware = (req, res, next) => {
	// req.userId should be set
	const key = req.userId ? req.userId : req.ip;
	const pointsToConsume = req.userId ? 1 : 30;
	rateLimiterRedis
		.consume(key, pointsToConsume)
		.then(() => {
			next();
		})
		.catch((_) => {
			res.status(429).send("Too Many Requests");
		});
};

app.use(rateLimiterMiddleware);
