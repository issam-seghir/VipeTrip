const express = require("express");

const router = express.Router();
const { upload, uploadPost } = require("@/middleware/multer/multerUploader");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const nodemailer = require("nodemailer");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");

// testing multer
router.post("/upload", upload.array("picture", 2), multerErrorHandler(upload), (req, res) => {
	res.status(200).send("pictures uploaded");
});
router.post("/uploadPost", uploadPost.array("picture", 3), multerErrorHandler(uploadPost), (req, res) => {
	res.status(200).send("picture for posts  uploaded");
});

router.post(
	"/forget",
	asyncWrapper(async (req, res, next) => {
		// Generate SMTP service account from ethereal.email
		nodemailer.createTestAccount((err, account) => {
			if (err) {
				console.error("Failed to create a testing account. " + err.message);
				throw new Error(err.message);
			}

			console.log("Credentials obtained, sending message...");

			// Create a SMTP transporter object
			let transporter = nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure,
				auth: {
					user: account.user,
					pass: account.pass,
				},
			});

			// Message object
			let message = {
				from: "vipetrip@gmail.com",
				to: "recipient@example.com",
				subject: "Nodemailer testing : Password Reset",
				text: "Hello for testing!",
				html: "<p><b>Hello</b> for testing!</p>",
			};

			transporter.sendMail(message, (err, info) => {
				if (err) {
					console.log("Error occurred. " + err.message);
					throw new Error(err.message);
				}

				console.log("Message sent: %s", info.messageId);
				// Preview only available when sending through an Ethereal account
				console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			});
		});
	})
);

module.exports = router;
