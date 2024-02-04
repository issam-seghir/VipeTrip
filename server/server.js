// add alias
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const rateLimiterMiddleware = require("@middleware/rateLimiter");
const { isDev } = require("@config/const");
const { readyStates } = require("@config/const");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { connection } = require("mongoose");
const multerErrorHandler = require("@middleware/multerErrorHandler");
const { join } = require("node:path");
const { corsOptions } = require("@config/corsOptions");
const connectDB = require("@config/dbConn");
const { helmetOptions } = require("@config/helmetOptions");
const credentials = require("@middleware/credentials");
const morgan = require("morgan");
const attachMetadata = require("@middleware/attachMetadata");
const errorHandler = require("@middleware/errorHandler");
const errorhandler = require("errorhandler");
const pino = require("pino-http")();
const errorNotification = require("@config/notifier");
const compression = require("compression");


const PORT = process.env.PORT || 3000;

const app = express();

// Connect to MongoDB
connectDB();

// Use Helmet for header security !
app.use(helmet(helmetOptions));

// morgan console logger
app.use(morgan("dev"));

// pino logger
app.use(
	pino({
		transport: {
			target: "pino-pretty",
		},
	})
);

// app.get("/", function (req, res) {
// 	req.log.info("something");
// 	res.send("hello world");
// });

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
app.use(compression())


//serve static files
app.use(express.static(join(__dirname, "public")));

app.use("/api/v1", require("@api/v1"));

// app.use(multerErrorHandler(upload));
// app.use(multerErrorHandler(uploadPost));

if (isDev) {
	// only use in development
	app.use(errorhandler({ log: errorNotification }));
} else {
	// use a simpler error handler in production
	app.use(errorHandler);
}

connection.once("open", () => {
	console.log("Connected to MongoDB .... 🐲");
	const MongoDbInfo = {
		"DB Name": mongoose.connection.db.databaseName,
		State: readyStates.get(mongoose.connection.readyState) || "Key not found",
		Host: mongoose.connection.host,
		Port: mongoose.connection.port,
	};
	console.table(MongoDbInfo);

	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
