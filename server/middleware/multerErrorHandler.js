const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			res.status(413).send(`File too large. Maximum allowed size is ${err.limit / (1024 * 1024)}MB`);
		} else {
			res.status(500).send(err.message);
		}
	} else if (err.message.startsWith("Invalid file type")) {
		res.status(400).send(err.message);
	} else {
		next(err);
	}
};

module.exports = multerErrorHandler;
