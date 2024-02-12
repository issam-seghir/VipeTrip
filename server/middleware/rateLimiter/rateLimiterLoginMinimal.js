/*
Minimal protection against password brute-force
Disallow too many wrong password tries. Block user account for some period of time on limit reached.

The idea is simple:

get number of wrong tries and block request if limit reached.
if correct password, reset wrong password tries count.
if wrong password, count = count + 1.

*/

const http = require("node:http");
const express = require("express");
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
// You may also use Mongo, Memory or any other limiter type

const redisClient = new Redis({ enableOfflineQueue: false });

const maxConsecutiveFailsByUsername = 5;

const limiterConsecutiveFailsByUsername = new RateLimiterRedis({
	redis: redisClient,
	useRedisPackage: true,
	keyPrefix: "login_fail_consecutive_username",
	points: maxConsecutiveFailsByUsername,
	duration: 60 * 60 * 3, // Store number for three hours since first fail
	blockDuration: 60 * 15, // Block for 15 minutes
});

async function loginRoute(req, res) {
	const username = req.body.email;
	const rlResUsername = await limiterConsecutiveFailsByUsername.get(username);

	if (rlResUsername !== null && rlResUsername.consumedPoints > maxConsecutiveFailsByUsername) {
		const retrySecs = Math.round(rlResUsername.msBeforeNext / 1000) || 1;
		res.set("Retry-After", String(retrySecs));
		res.status(429).send("Too Many Requests");
	} else {
		const user = authorise(username, req.body.password); // should be implemented in your project

		if (!user.isLoggedIn) {
			try {
				await limiterConsecutiveFailsByUsername.consume(username);

				res.status(400).end("email or password is wrong");
			} catch (error) {
				if (error instanceof Error) {
					throw error;
				} else {
					res.set("Retry-After", String(Math.round(error.msBeforeNext / 1000)) || 1);
					res.status(429).send("Too Many Requests");
				}
			}
		}

		if (user.isLoggedIn) {
			if (rlResUsername !== null && rlResUsername.consumedPoints > 0) {
				// Reset on successful authorisation
				await limiterConsecutiveFailsByUsername.delete(username);
			}

			res.end("authorised");
		}
	}
}

const app = express();

app.post("/login", async (req, res) => {
	try {
		await loginRoute(req, res);
	} catch {
		res.status(500).end();
	}
});
