const express = require("express");
const passport = require("passport");
const { isProd } = require("@config/const");
const {convertToMilliseconds} = require("@utils/index");
const ms = require("ms")

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


router.get(
	"/login/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		failureRedirect: `${ENV.CLEINT_URL}`,
		session: false,
	}),
	asyncWrapper(async (req, res, next) => {

		const foundUser = await User.findOne({ email: req.user.email });

		if (!foundUser) return res.status(404).json({ message: "User not found" });
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
		// Set access token as a cookie
		res.cookie("socialToken", accessToken, {
			httpOnly: false,
			secure: isProd,
			sameSite: isProd ? "strict" : "Lax",
			maxAge: ms(ENV.ACCESS_TOKEN_SECRET_EXPIRE_REMEMBER_ME),
		});
		// Redirect to client's URL
		res.redirect(`${ENV.CLEINT_URL}/home`);
	})
);

router.get(
	"/login/facebook",
	passport.authenticate("facebook", {
		scope: ["public_profile", "email", "user_hometown", "user_location"],
	})
);

router.get(
	"/oauth2/redirect/facebook",
	passport.authenticate("facebook", {
		failureRedirect: `${ENV.CLEINT_URL}`,
		session: false,
	}),
	asyncWrapper(async (req, res, next) => {
		const foundUser = await User.findOne({ email: req.user.email });

		if (!foundUser) return res.status(404).json({ message: "User not found" });
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
		// Set access token as a cookie
		res.cookie("socialToken", accessToken, {
			httpOnly: false,
			secure: isProd,
			sameSite: isProd ? "strict" : "Lax",
			maxAge: ms(ENV.ACCESS_TOKEN_SECRET_EXPIRE_REMEMBER_ME),
		});
		// Redirect to client's URL
		res.redirect(`${ENV.CLEINT_URL}/home`);
	})
);


router.get(
	"/login/github",
	passport.authenticate("github", {
		scope: ["user:email"],
	})
);

router.get(
	"/oauth2/redirect/github",
	passport.authenticate("github", {
		failureRedirect: `${ENV.CLEINT_URL}`,
		session: false,
	}),
	asyncWrapper(async (req, res, next) => {
		const foundUser = await User.findOne({ email: req.user.email });

		if (!foundUser) return res.status(404).json({ message: "User not found" });
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
		// Set access token as a cookie
		res.cookie("socialToken", accessToken, {
			httpOnly: false,
			secure: isProd,
			sameSite: isProd ? "strict" : "Lax",
			maxAge: ms(ENV.ACCESS_TOKEN_SECRET_EXPIRE_REMEMBER_ME),
		});
		// Redirect to client's URL
		res.redirect(`${ENV.CLEINT_URL}/home`);
	})
);



router.get(
	"/login/linkedin",
	passport.authenticate("linkedin", {
		scope: ["email", "profile","openid"],
	})
);

router.get(
	"/oauth2/redirect/linkedin",
	passport.authenticate("linkedin", {
		failureRedirect: `${ENV.CLEINT_URL}`,
		session: false,
	}),
	asyncWrapper(async (req, res, next) => {
		const foundUser = await User.findOne({ email: req.user.email });

		if (!foundUser) return res.status(404).json({ message: "User not found" });
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
		// Set access token as a cookie
		res.cookie("socialToken", accessToken, {
			httpOnly: false,
			secure: isProd,
			sameSite: isProd ? "strict" : "Lax",
			maxAge: ms(ENV.ACCESS_TOKEN_SECRET_EXPIRE_REMEMBER_ME),
		});
		// Redirect to client's URL
		res.redirect(`${ENV.CLEINT_URL}/home`);
	})
);





router.get("/check-email", checkEmailExists);
router.post("/forget", validate(resetPasswordRequestSchema), resetPasswordRequest);
router.post("/reset", validate(resetPasswordSchema), resetPassword);

router.post("/register", upload.single("picture"), multerErrorHandler(upload), validate(registerSchema), handleNewUser);

router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
