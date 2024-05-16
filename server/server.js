// add alias
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const { rateLimiterMiddleware, rateLimiterMiddlewareSocketIo } = require("@/middleware/rateLimiter/rateLimiter");
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

// global mongoose plugins : declare them before declarring any mongoose module
mongoose.plugin(normalize);
mongoose.plugin(autopopulate);

const SocketSession = require("@model/SocketSession");
const Notification = require("@model/Notification");
const User = require("@model/User");

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

// if you're using common js
const StreamChat = require('stream-chat').StreamChat;

// instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
// find your API keys here https://getstream.io/dashboard/
const serverClient = StreamChat.getInstance('3jjquz92zekn', 'wf3bmbt9fsvq5mtv25vzgqy67uj3c6dpamk2jv5ay6hde2xk2exw7ab5nvvzv2qs');
// you can still use new StreamChat('api_key', 'api_secret');

// generate a token for the user with id 'john'
app.get("/stream-chat/token", (req, res) => {
	const userId = req.user.id;
	const token = serverClient.createToken(userId);
	res.json({ token });
});
// next, hand this token to the client in your in your login or registration response


// init socket io
const io = new Server(server, {
	// synchronize the state of the client upon reconnection:
	connectionStateRecovery: {},
	cors: corsOptions,
});

//  jwt auth the socket server

io.engine.use(verifyJWT);
io.engine.use(rateLimiterMiddlewareSocketIo);

// Socket.io
io.on("connection", async (socket) => {
	const userId = socket.request.user.id;

	// The user ID is used as a room
	socket.join(`user:${userId}`);

	console.log("a user connected");
	console.log(userId);

	// Emit the 'user online' event to all connections except current user
	socket.broadcast.emit("user online", { userId });

	try {
		const userId = socket.request.user.id;

		// If a user connects multiple times with the same user ID,
		// this will overwrite their previous session.
		// If you want to allow multiple sessions per user, you might need to adjust this.
		const existingSession = await SocketSession.findOne({ userId });
		if (existingSession) {
			await SocketSession.updateOne({ userId }, { socketId: socket.id });
		} else {
			const socketSession = new SocketSession({ userId, socketId: socket.id });
			await socketSession.save();
		}

		socket.on("disconnect", async () => {
			try {
				await SocketSession.deleteOne({ socketId: socket.id });
			} catch (error) {
				console.error("Failed to delete user session:", error);
			}
		});
	} catch (error) {
		console.error("Failed to create user session:", error);
	}

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

		// Emit the 'user online' event to all connections except current user
		socket.broadcast.emit("user offline", { userId });
	});
	// Listen for a friend request event
	// Listen for a friend request event
	socket.on("friend request", async (request) => {
		console.log("send friend request");
		console.log(request);
		try {
			if (!request) {
				return;
			}

			// Create a new notification for the receiver
			const notification = new Notification({
				userTo: receiverId,
				userFrom: senderId,
				type: "FriendRequest",
				content: `${data?.sender?.name} has sent you a friend request.`,
			});

			await notification.save();

			// Emit a friend request event to the recipient
			io.to(`user:${request?.friendId?.id}`).emit("notification", { data: request, type: "friend-request" });
			// for adding "confirm request" label in receiver button
			io.to(`user:${request?.friendId?.id}`).emit("friend request pending", { data: request });
		} catch (error) {
			console.error(`Error handling 'friendRequest' event: ${error.message}`);
		}
	});
	socket.on("cancel friend request", (profileId) => {
		console.log(profileId);
		io.to(`user:${profileId}`).emit("friend request declined", profileId);
	});
	socket.on("accept friend request", (request) => {
		io.to(`user:${request?.userId}`).emit("friend request accepted", request);
		io.to(`user:${request?.friendId}`).emit("friend request accepted", request);
	});
	socket.on("remove friend", (profileId) => {
		io.to(`user:${profileId}`).emit("removed friendShip", profileId);
	});

	// Listen for a new like event (like on a post or comment)
	socket.on("new like", async (data) => {
		try {
			if (!data) {
				return;
			}

			// Check if the liker is the same as the author of the post or comment
			const postAuthorId = data?.type === "Post" ? data?.likedPost?.author.id : data?.likedComment?.author.id;
			if (data?.liker?.id === postAuthorId) {
				// The user liked their own post/comment, so don't emit a notification
				return;
			}

			// real time likes for all other users
			socket.broadcast.emit("like update", data?.likedPost?.id);

			// Check if a like notification already exists
			const notificationQuery = {
				userTo: postAuthorId,
				userFrom: data?.liker?.id,
				type: "Like",
			};

			if (data?.likedComment?.id) {
				notificationQuery.comment = data?.likedComment?.id;
			}
			if (data?.likedPost?.id) {
				notificationQuery.post = data?.likedPost?.id;
			}
			const existingNotification = await Notification.findOne(notificationQuery);

			// If a like notification already exists, don't create a new one
			if (existingNotification) {
				return;
			}

			// Create a new notification
			const notification = new Notification(notificationQuery);

			await notification.save();

			// Emit a notification event to the author of the post/comment
			io.to(`user:${postAuthorId}`).emit("notification");
		} catch (error) {
			console.error(`Error handling 'new like' event: ${error.message}`);
		}
	});

	// Listen for a new comment event
	socket.on("new comment", async (data) => {
		try {
			if (!data) {
				return;
			}

			if (data?.author?.id === data?.post?.author?.id) {
				// The user liked their own post/comment, so don't emit a notification
				return;
			}

			// Create a new notification
			const notification = new Notification({
				userTo: data?.post?.author?.id,
				userFrom: data?.author?.id,
				post: data?.post?.id,
				comment: data?.id,
				type: "Comment",
			});

			await notification.save();

			// Emit a notification event to the author of the post/comment
			io.to(`user:${data?.post?.author?.id}`).emit("notification");
		} catch (error) {
			console.error(`Error handling 'new comment' event: ${error.message}`);
		}
	});

	// listen for a new replay event
	socket.on("new reply", async (data) => {
		try {
			if (!data) {
				return;
			}
			// Check if the reply author is the same  author of  the comment
			const authorId = data?.author?.id;
			const parentCommentAuthorId = data?.parentComment?.author?.id;

			if (authorId === parentCommentAuthorId) {
				// The user replied to their own comment, so don't emit a notification
				return;
			}

			// Create a new notification
			const notification = new Notification({
				userTo: parentCommentAuthorId,
				userFrom: authorId,
				post: data?.post?.id,
				comment: data?.id,
				type: "Comment",
			});

			await notification.save();

			// Emit a notification event to the author of the post/comment
			io.to(`user:${parentCommentAuthorId}`).emit("notification");
		} catch (error) {
			console.error(`Error handling 'new replay' event: ${error.message}`);
		}
	});
	socket.on("new post", async (data) => {
		try {
			if (!data) {
				return;
			}
			const authorId = data?.author?.id;

			const user = await User.findById(authorId);
			const friends = user.friends;
			// Create a new notification for each friend
			for (let friendId of friends) {
				const notification = new Notification({
					userTo: friendId,
					userFrom: authorId,
					post: data?.id,
					type: "Post",
				});

				await notification.save();

				// Emit a notification event to the friend
				io.to(`user:${friendId}`).emit("notification");
			}
		} catch (error) {
			console.error(`Error handling 'new post' event: ${error.message}`);
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
