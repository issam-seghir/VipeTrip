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

// global mongoose plugins
mongoose.plugin(normalize);
mongoose.plugin(autopopulate);

const PORT = ENV.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

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

// Socket.io
io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
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
