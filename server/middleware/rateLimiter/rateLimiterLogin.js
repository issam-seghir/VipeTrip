/*
Block source of requests by IP, Username and IP
This example referrers to the second option from the previous part

Create 2 types of limiters.
The first counts number of consecutive failed attempts and allows maximum 10 by username and IP pair.
The second blocks IP for 1 day on 100 failed attempts per day.
 */

const http = require("node:http");
const express = require("express");
const mongoose = require("mongoose");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const mongoConn = mongoose.connection;

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterRedis({
	redis: mongoConn,
	keyPrefix: "login_fail_ip_per_day",
	points: maxWrongAttemptsByIPperDay,
	duration: 60 * 60 * 24,
	blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
	redis: mongoConn,
	keyPrefix: "login_fail_consecutive_username_and_ip",
	points: maxConsecutiveFailsByUsernameAndIP,
	duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
	blockDuration: 60 * 60 * 24 * 365 * 20, // Block for infinity after consecutive fails
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

async function loginRoute(req, res) {
	const ipAddr = req.connection.remoteAddress;
	const usernameIPkey = getUsernameIPkey(req.body.email, ipAddr);

	const [resUsernameAndIP, resSlowByIP] = await Promise.all([limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey), limiterSlowBruteByIP.get(ipAddr)]);

	let retrySecs = 0;

	// Check if IP or Username + IP is already blocked
	if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
		retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
	} else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
		retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
	}

	if (retrySecs > 0) {
		res.set("Retry-After", String(retrySecs));
		res.status(429).send("Too Many Requests");
	} else {
		const user = authorise(req.body.email, req.body.password);
		if (!user.isLoggedIn) {
			// Consume 1 point from limiters on wrong attempt and block if limits reached
			try {
				const promises = [limiterSlowBruteByIP.consume(ipAddr)];
				if (user.exists) {
					// Count failed attempts by Username + IP only for registered users
					promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
				}

				await Promise.all(promises);

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
			if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
				// Reset on successful authorisation
				await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
			}

			res.end("authorized");
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
