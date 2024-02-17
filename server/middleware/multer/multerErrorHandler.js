const multer = require("multer");
const { byteToMb } = require("@utils");
const log = require("@/utils/chalkLogger");
const { Unauthorized, InternalServerError, Forbidden } = require("http-errors");


const multerErrorHandler = (upload) => {
	return (err, req, res, next) => {
		if (err instanceof multer.MulterError) {
			let message = err.message;
			log.error(err);
			log.info(upload);
			switch (err.code) {
				case "LIMIT_FILE_SIZE": {
					const fileSizeLimitInMB = byteToMb(upload.limits.fileSize);
					message = `File too large. Maximum allowed size is ${fileSizeLimitInMB}MB`;
					break;
				}
				case "LIMIT_PART_COUNT": {
					message = `Too many fields. Maximum allowed is ${upload.limits.fields}.`;
					break;
				}
				case "LIMIT_FILE_COUNT": {
					message = `Too many files. Maximum allowed is ${upload.limits.files}.`;
					break;
				}
				case "LIMIT_FIELD_KEY": {
					message = `Field name too long. Maximum allowed length is ${upload.limits.fieldNameSize}.`;
					break;
				}
				case "LIMIT_FIELD_VALUE": {
					message = `Field value too long. Maximum allowed length is ${upload.limits.fieldSize}.`;
					break;
				}
				case "LIMIT_FIELD_COUNT": {
					message = `Too many fields. Maximum allowed is ${upload.limits.fields}.`;
					break;
				}
				case "LIMIT_UNEXPECTED_FILE": {
					message = `Unexpected field Name , ex: upload.single||array("field-name")`;
					break;
				}
				default: {
					// Unexpected server error
					res.status(500).send(message);
					break;
				}
			}
			res.status(400).send(message);
		} else {
			// Other errors
			next(err);
		}
	};
};

module.exports = multerErrorHandler;
