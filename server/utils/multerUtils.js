// @ts-check
const path = require("node:path");

/**
 * @typedef {Object} MulterFile
 * @property {string} mimetype - The MIME type of the file.
 * @property {string} originalname - The original name of the file.
 */

/**
 * @typedef {import('express').Request & { acceptedFileTypes?: RegExp }} CustomRequest
 */


/**
 * Middleware function for Multer that filters files based on their mimetype.
 * If the file's mimetype starts with "image/", it passes the file to the next middleware.
 * Otherwise, it throws an error.
 *
 * @param {CustomRequest} req - The Express request object.
 * @param {MulterFile} file - The file object.
 * @param {(error: (Error | null), acceptFile?: boolean) => void} cb - The callback to be invoked when the file has been processed.
 * @returns {void}
 */


const fileFilterPost = (req, file, cb) => {
	// reject a file
	req.acceptedFileTypes = /jpeg|jpg|png|webp/;
	const mimetype = req.acceptedFileTypes.test(file.mimetype);
	const extname = req.acceptedFileTypes.test(path.extname(file.originalname).toLowerCase());

	if (mimetype && extname) {
		return cb(null, true);
	}

	cb(new Error(`Invalid file type. Only ${req.acceptedFileTypes.toString()} are allowed.`));
};



/**
 * Middleware function for Multer that filters files based on their mimetype and extension.
 * If the file's mimetype and extension are accepted, it passes the file to the next middleware.
 * Otherwise, it throws an error.
 *
 * @param {CustomRequest} req - The Express request object.
 * @param {MulterFile} file - The file object.
 * @param {(error: (Error | null), acceptFile?: boolean) => void} cb - The callback to be invoked when the file has been processed.
 * @returns {void}
 */
const fileFilter = (req, file, cb) => {
	// Allow all image types
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error(`Invalid file type. Only image files are allowed.`));
	}
};

module.exports = { fileFilter, fileFilterPost };
