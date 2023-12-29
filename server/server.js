// add alias
require("module-alias/register");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { connection } = require("mongoose");

const { join } = require("node:path");
const corsOptions = require("@config/corsOptions");
const connectDB = require("@config/dbConn");
const { helmetOptions } = require("@config/helmetOptions");
const credentials = require("@middleware/credentials");
const errorHandler = require("@middleware/errorHandler");
const verifyJWT = require("@middleware/verifyJWT");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

const app = express();

// Connect to MongoDB
connectDB();

// Use Helmet for header security !
// Content-Security-Policy header.
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
app.use(cookieParser());

//serve static files
app.use(express.static(join(__dirname, "public")));



// app.post("/upload", upload.single("myFile"), (req, res, next) => {
// 	const file = req.file;
// 	if (!file) {
// 		const error = new Error("Please upload a file");
// 		error.httpStatusCode = 400;
// 		return next(error);
// 	}
// 	res.send(file);
// });

// routes
app.use("/", require("@routes/root"));
app.use("/auth",  require("@routes/auth"));
// app.use("/refresh", require("@routes/refresh"));
// app.use("/logout", require("@routes/logout"));

app.use(verifyJWT);
// app.use("/employees", require("@routes/api/employees"));
app.use("/users", require("@routes/api/users"));

// app.all("*", (req, res) => {
// 	res.status(404);
// 	if (req.accepts("html")) {
// 		res.sendFile(join(__dirname, "views", "404.html"));
// 	} else if (req.accepts("json")) {
// 		res.json({ error: "404 Not Found" });
// 	} else {
// 		res.type("txt").send("404 Not Found");
// 	}
// });

app.use(errorHandler);

connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
