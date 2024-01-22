const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		// A Multer error occurred when uploading.
		if (err.code === "LIMIT_FILE_SIZE") {
			res.status(413).send("File too large");
		} else {
			res.status(500).send(err.message);
		}
	} else {
		next(err);
	}
};

module.exports = multerErrorHandler;
