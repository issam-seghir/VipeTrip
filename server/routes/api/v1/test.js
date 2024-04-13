const express = require("express");

const router = express.Router();
const { upload, uploadPost } = require("@/middleware/multer/multerUploader");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const nodemailer = require("nodemailer");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const createError = require("http-errors");
const User = require("@model/User");
const ResetToken = require("@model/ResetToken");
const bcrypt = require("bcrypt");
const { ENV } = require("@/validations/envSchema");
const { generateResetToken } = require("@utils/index");
const { resetPasswordRequestSchema, resetPasswordSchema } = require("@validations/authSchema");
const validate = require("express-zod-safe");

// testing multer
router.post("/upload", upload.array("picture", 2), multerErrorHandler(upload), (req, res) => {
	res.status(200).send("pictures uploaded");
});
router.post("/uploadPost", uploadPost.array("picture", 3), multerErrorHandler(uploadPost), (req, res) => {
	res.status(200).send("picture for posts  uploaded");
});

router.post(
	"/forget-mail",
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

/**
 * @typedef {import('@validations/authSchema').resetPasswordRequestBody} resetPasswordRequestBody
 */

router.post(
	"/forget",
	validate(resetPasswordRequestSchema),
	asyncWrapper(async (req, res, next) => {
		/** @type {resetPasswordRequestBody} */
		const { email } = req.body;

		// Hash the reset token and set it in the user's document, along with an expiry time
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ field: "email", message: "No account with that email exists" });

		// Delete any existing reset tokens
		let token = await ResetToken.findOne({ userId: user._id });
		if (token) await token.deleteOne();

		// Generate a reset token
		const resetToken = generateResetToken();
		const hashedToken = await bcrypt.hash(resetToken, 10);

		// Create a new reset token document
		const tokenDocument = new ResetToken({
			userId: user._id,
			token: hashedToken,
			createdAt: Date.now(),
		});
		await tokenDocument.save();

		res.status(200).json({ token: resetToken });
	})
);
/**
 * @typedef {import('@validations/authSchema').resetPasswordBody} resetPasswordBody
 */
router.post(
	"/reset",
	validate(resetPasswordSchema),
	// Step 2: User enters a new password
	asyncWrapper(async (req, res, next) => {
		/** @type {resetPasswordBody} */
		const { password, token, userId } = req.body;
		// Find the reset token document

		const tokenDocument = await ResetToken.findOne({ userId });
		if (!tokenDocument)
			return res.status(404).json({
				massage:
					"The password reset token you provided is either invalid or has expired. Please request a new one.",
			});

		// Verify the token
		const isValid = await bcrypt.compare(token, tokenDocument.token);
		if (!isValid)
			return res.status(400).json({
				massage:
					"The password reset token you provided does not match our records. Please check the token and try again.",
			});

		// Hash the new password and update the user's password
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } }, { new: true });
		const user = await User.findById({ _id: userId });

		// Delete the reset token document
		await tokenDocument.deleteOne();
		res.status(200).json({
			message: "Your password has been changed Successfully",
			info: { fullName: user.fullName, email: user.email },
		});
	})
);

module.exports = router;
