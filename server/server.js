// add alias
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const rateLimiterMiddleware = require("@/middleware/rateLimiter/rateLimiter");
const { readyStates } = require("@config/const");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { connection } = require("mongoose");
const { join } = require("node:path");
const { corsOptions } = require("@config/corsOptions");
const { connectDB } = require("@config/dbConn");
const { helmetOptions } = require("@config/helmetOptions");
const credentials = require("@/middleware/auth/credentials");
const morgan = require("morgan");
const attachMetadata = require("@middleware/attachMetadata");
const errorHandler = require("@middleware/errorHandler");
const compression = require("compression");
const { ENV } = require("@/validations/envSchema");
const { pinoLog } = require("@config/pinoConfig");
const log = require("@/utils/chalkLogger");
const { generateMockUser } = require("@utils/mockSchema");
const { normalize } = require("@utils/plugins");
const autopopulate = require("mongoose-autopopulate");
const passport = require("passport");
const { passportConfig } = require("@config/PassportjsConfig");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const verifyJWT = require("@/middleware/auth/verifyJWT");
// const { getUserFriends } =  require("@/controllers/socketController");

// global mongoose plugins
mongoose.plugin(normalize);
mongoose.plugin(autopopulate);

const PORT = ENV.PORT;

const app = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

// Use Helmet for header security !
app.use(helmet(helmetOptions));

// morgan console logger
app.use(morgan("dev"));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// limits number of actions by key and protects from DDoS and brute force attacks at any scale.
app.use(rateLimiterMiddleware);

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// built-in middleware for json
app.use(express.json({ limit: "1mb" }));

//middleware for cookies
// allows you to access cookie values via req.cookies.
app.use(cookieParser());

// attach metadata (req time , IP , user agent) to request object
app.use(attachMetadata);

// compress all responses
app.use(compression());

//serve static files
app.use(express.static(join(__dirname, "public")));
// disable "x-powered-by Express" in the req header
app.disable("x-powered-by");

// initialize passportJS (make sure you have a cookieParser middleware before this)
app.use(passport.initialize());
// all Oauth here : google , facebook ...
passportConfig(passport);

app.use("/api/v1", require("@api/v1"));

// global error handling
app.use(errorHandler);

// init socket io
const io = new Server(server, {
	// synchronize the state of the client upon reconnection:
	connectionStateRecovery: {},
	cors: corsOptions,
});

//  jwt auth the socket server

io.engine.use(verifyJWT);

// Socket.io
io.on("connection", async (socket) => {
	const userId = socket.request.user.id;

	// The user ID is used as a room
	socket.join(`user:${userId}`);

	console.log("a user connected");
	console.log(userId);

	// Emit the 'user online' event to all connections of this user
	io.to(`user:${userId}`).emit("user online", { userId: socket.id });

	socket.on("testEvent", (data) => {
		console.log("Received testEvent with data:", data);

		socket.emit("testResponse", "Test response");
	});
	socket.on("test Hook", (data) => {
		console.log("Received test Hook from client :", data);

		socket.emit("test Hook", "Test Hook server response");
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");

		// Emit the 'user offline' event to all connections of this user
		io.to(`user:${userId}`).emit("user offline", { userId: socket.id });
	});
	// Listen for a friend request event
	// Listen for a friend request event
	socket.on("friend request", (request) => {
		console.log(request);
	});

	// Listen for a new like event (like on a post or comment)
	socket.on("new like", (data) => {
		try {
			if (!data) {
				return;
			}

			// Check if the liker is the same as the author of the post or comment
			const authorId = data?.type === "Post" ? data?.likedPost?.author.id : data?.likedComment?.author.id;
			if (data?.liker?.id === authorId) {
				// The user liked their own post/comment, so don't emit a notification
				return;
			}
			// Emit a notification event to the author of the post/comment
			io.to(`user:${authorId}`).emit("notification", { data, type: "like" });
		} catch (error) {
			console.error(`Error handling 'new like' event: ${error.message}`);
		}
	});

	// Listen for a new comment event
	socket.on("new comment", (data) => {
		try {
			if (!data) {
				return;
			}
			// Check if the liker is the same as the author of the post or comment
			// const authorId = data?.type === "Post" ? data?.likedPost?.author.id : data?.likedComment?.author.id;
			if (data?.author?.id === data?.post?.author?.id) {
				// The user liked their own post/comment, so don't emit a notification
				return;
			}
			// Emit a notification event to the author of the post/comment
			io.to(`user:${data?.post?.author?.id}`).emit("notification", { data, type: "new-comment" });
		} catch (error) {
			console.error(`Error handling 'new comment' event: ${error.message}`);
		}
	});

	// listen for a new replay event
	socket.on("new reply", (data) => {
		try {
			if (!data) {
				return;
			}
			// Check if the liker is the same as the author of the post or comment
			// const authorId = data?.type === "Post" ? data?.likedPost?.author.id : data?.likedComment?.author.id;
			if (data?.author?.id === data?.parentComment?.author?.id) {
				// The user liked their own post/comment, so don't emit a notification
				return;
			}
			// Emit a notification event to the author of the post/comment
			io.to(`user:${data?.parentComment?.author?.id}`).emit("notification", { data, type: "new-reply" });
		} catch (error) {
			console.error(`Error handling 'new replay' event: ${error.message}`);
		}
	});
	socket.on("new post", (data) => {
			try {
				if (!data) {
					return;
				}
				// Check if the liker is the same as the author of the post or comment
				// const authorId = data?.type === "Post" ? data?.likedPost?.author.id : data?.likedComment?.author.id;
				if (data?.author?.id === data?.parentComment?.author?.id) {
					// The user liked their own post/comment, so don't emit a notification
					return;
				}
				// Emit a notification event to the author of the post/comment
				io.to(`user:${data?.parentComment?.author?.id}`).emit("notification", { data, type: "new-reply" });
			} catch (error) {
				console.error(`Error handling 'new replay' event: ${error.message}`);
			}
	});

});

connection.once("open", () => {
	console.log("Connected to MongoDB .... 🐲");
	const MongoDbInfo = {
		"DB Name": mongoose.connection.db.databaseName,
		State: readyStates.get(mongoose.connection.readyState) || "Key not found",
		Host: mongoose.connection.host,
		Port: mongoose.connection.port,
	};
	console.table(MongoDbInfo);

	server.listen(PORT, () => log.database(`Server running on port `, `${PORT}`));
});
