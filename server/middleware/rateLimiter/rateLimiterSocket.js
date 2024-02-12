// Websocket single connection prevent flooding

const app = require("node:http").createServer();
const io = require("socket.io")(app);
const { RateLimiterMemory } = require("rate-limiter-flexible");

app.listen(3000);

const rateLimiter = new RateLimiterMemory({
	points: 5, // 5 points
	duration: 1, // per second
});

io.on("connection", (socket) => {
	socket.on("bcast", async (data) => {
		try {
			await rateLimiter.consume(socket.handshake.address); // consume 1 point per event from IP
			socket.emit("news", { data: data });
			socket.broadcast.emit("news", { data: data });
		} catch (error) {
			// no available points to consume
			// emit error or warning message
			socket.emit("blocked", { "retry-ms": error.msBeforeNext });
		}
	});
});
