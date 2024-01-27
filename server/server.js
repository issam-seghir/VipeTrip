// add alias
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { isDevelopment } = require("@config/const");
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
const errorHandler = require("@middleware/errorHandler");
const morgan = require("morgan");
const attachMetadata = require("@middleware/attachMetadata");
const errorhandler = require('errorhandler')

const PORT = process.env.PORT || 3000;

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

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
// allows you to access cookie values via req.cookies.
app.use(cookieParser());

// attach metadata (req time , IP , user agent) to request object
app.use(attachMetadata);

//serve static files
app.use(express.static(join(__dirname, "public")));

app.use("/api/v1", require("@api/v1"));

// app.use(multerErrorHandler(upload));
// app.use(multerErrorHandler(uploadPost));
if (isDevelopment) {
	// only use in development
	app.use(errorhandler());
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
