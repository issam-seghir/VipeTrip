const express = require("express");
const passport = require("passport");

const router = express.Router();
const {
	handleLogin,
	checkEmailExists,
	resetPasswordRequest,
	resetPassword,
} = require("@/controllers/auth/loginController");
const { handleNewUser } = require("@/controllers/auth/registerController");
const { handleLogout } = require("@/controllers/auth/logoutController");
const { handleRefreshToken } = require("@/controllers/auth/refreshTokenController");
const { upload } = require("@/middleware/multer/multerUploader");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const validate = require("express-zod-safe");
const User = require("@model/User");
const jwt = require("jsonwebtoken");
const { asyncWrapper } = require("@middleware/asyncWrapper");
const { ENV } = require("@/validations/envSchema");
const { getCookieOptions } = require("@config/cookieOptions");

const {
	registerSchema,
	loginSchema,
	resetPasswordRequestSchema,
	resetPasswordSchema,
} = require("@validations/authSchema");

router.post("/login", validate(loginSchema), handleLogin);

router.get("/login/google", passport.authenticate("google", { session: false, scope: ["openid", "profile", "email"] }));

// he failureMessage option which will add the message to req.session.messages
router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		session: false,
		failureRedirect: "/google_callback_fail",
		successRedirect: "/google_callback_success",
	})
);
router.get(
	"/google_callback_success",
	asyncWrapper(async (req, res, next) => {
		const foundUser = await User.findOne({ email: req.user.email });
		// create JWT Refresh Token
		const newRefreshToken = jwt.sign(
			{
				id: foundUser._id.toString(),
				email: foundUser.email,
			},
			ENV.REFRESH_TOKEN_SECRET,
			{ expiresIn: ENV.REFRESH_TOKEN_SECRET_EXPIRE_REMEMBER_ME }
		);

		// Saving refreshToken with current user in database
		foundUser.refreshToken = newRefreshToken;
		await foundUser.save();

		// Creates Secure Cookie with refresh token
		//? Use the httpOnly flag to prevent JavaScript from reading it.
		//? Use the secure=true flag so it can only be sent over HTTPS.
		//? Use the SameSite=strict flag whenever possible to prevent CSRF. This can only be used if the Authorization Server has the same site as your front-end.
		res.cookie("jwt", newRefreshToken, getCookieOptions(true));

		// Create JWT Access Token
		const accessToken = jwt.sign(
			{
				id: foundUser._id.toString(),
				email: foundUser.email,
			},
			ENV.ACCESS_TOKEN_SECRET,
			{ expiresIn: ENV.ACCESS_TOKEN_SECRET_EXPIRE_REMEMBER_ME }
		);

		// Send authorization roles and access token to user
		res.json({ success: `Google Login : ${foundUser.fullName}!`, token: accessToken, user: foundUser });
	})
);

router.get(
	"/google_callback_fail",
	asyncWrapper(async function (req, res, next) {
		res.json("the callback after google DID NOT authenticate the user");
	})
);

router.get("/check-email", checkEmailExists);
router.post("/forget", validate(resetPasswordRequestSchema), resetPasswordRequest);
router.post("/reset", validate(resetPasswordSchema), resetPassword);

router.post("/register", upload.single("picture"), multerErrorHandler(upload), validate(registerSchema), handleNewUser);

router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
