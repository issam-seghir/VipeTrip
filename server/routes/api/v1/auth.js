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

// router.get("/login/google", passport.authenticate("google"));

// he failureMessage option which will add the message to req.session.messages
// router.get(
// 	"/oauth2/redirect/google",
// 	passport.authenticate("google", {
// 		failureRedirect: "/api/v1/auth/google_callback_fail",
// 		successRedirect: "/api/v1/auth/google_callback_success",
// 		session: false,
// 	})
// );

router.get(
	"/login/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		failureRedirect: "/",
		session: false,
	}),
	asyncWrapper(async (req, res, next) => {
		console.log(req.user);
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

		const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Save JWT to localStorage
		const oldPersistStore = JSON.parse(window.localStorage.getItem('persist:store'));
		console.log(oldPersistStore);
		  oldPersistStore.auth.token = '${accessToken}';
          window.localStorage.setItem('persist:store', JSON.stringify(oldPersistStore));
        // Redirect browser to root of application
        window.location.href = '/';
      </script>
    </html>
    `;

		res.send(htmlWithEmbeddedJWT);
		// res.redirect(`${ENV.CLEINT_URL}/home`);
		// Send authorization roles and access token to user
		// res.json({ success: `Google Login : ${foundUser.fullName}!`, token: accessToken, user: foundUser });
	})
);

router.get("/check-email", checkEmailExists);
router.post("/forget", validate(resetPasswordRequestSchema), resetPasswordRequest);
router.post("/reset", validate(resetPasswordSchema), resetPassword);

router.post("/register", upload.single("picture"), multerErrorHandler(upload), validate(registerSchema), handleNewUser);

router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
