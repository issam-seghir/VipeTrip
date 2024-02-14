// add alias
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const rateLimiterMiddleware = require("@/middleware/rateLimiter/rateLimiter");
const { isDev } = require("@config/const");
const { readyStates } = require("@config/const");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { connection } = require("mongoose");
const { join } = require("node:path");
const { corsOptions } = require("@config/corsOptions");
const connectDB = require("@config/dbConn");
const { helmetOptions } = require("@config/helmetOptions");
const credentials = require("@/middleware/auth/credentials");
const morgan = require("morgan");
const attachMetadata = require("@middleware/attachMetadata");
const errorHandler = require("@middleware/errorHandler");
const errorhandler = require("errorhandler");
const errorNotification = require("@config/notifier");
const compression = require("compression");
const { ENV } = require("@/validations/envSchema");
const { pinoLog } = require("@config/pinoConfig");
const log = require("@/utils/chalkLogger");
const { faker } = require("@faker-js/faker");
const { UniqueEnforcer } = require("enforce-unique");

const uniqueEnforcerEmail = new UniqueEnforcer();

const PORT = ENV.PORT;

const app = express();

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

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = uniqueEnforcerEmail.enforce(() => {
	return faker.internet.email({ firstName, lastName });
});
const mockUserFaker = {
	firstName: firstName,
	lastName: lastName,
	email: email,
	password: faker.internet.password(),
	picturePath: faker.image.avatar(),
	coverPath: faker.image.urlPlaceholder(),
	totalPosts: faker.number.int({ min: 0, max: 100 }),
	location: faker.location.country(),
	job: faker.person.jobTitle(),
	viewedProfile: faker.number.int({ min: 1, max: 1000 }),
	impressions: faker.number.int({ min: 1, max: 1000 }),
};

console.log(mockUserFaker);

// app.use("/api/v1", require("@api/v1"));

// errorhandler for requests  only use in development
isDev && app.use(errorhandler({ log: errorNotification }));
// global error handling
app.use(errorHandler);

connection.once("open", () => {
	console.log("Connected to MongoDB .... 🐲");
	const MongoDbInfo = {
		"DB Name": mongoose.connection.db.databaseName,
		State: readyStates.get(mongoose.connection.readyState) || "Key not found",
		Host: mongoose.connection.host,
		Port: mongoose.connection.port,
	};
	console.table(MongoDbInfo);

	app.listen(PORT, () => log.database(`Server running on port `, `${PORT}`));
});
