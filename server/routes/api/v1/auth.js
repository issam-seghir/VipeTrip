const express = require("express");

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
const {
	registerSchema,
	loginSchema,
	resetPasswordRequestSchema,
	resetPasswordSchema,
} = require("@validations/authSchema");

router.post("/login", validate(loginSchema), handleLogin);
// router.get("/login/google", passport.authenticate("google"));
router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", { failureRedirect: "/login", failureMessage: true }),
	function (req, res) {
		res.redirect("/");
	}
);
router.get("/check-email", checkEmailExists);
router.post("/forget", validate(resetPasswordRequestSchema), resetPasswordRequest);
router.post("/reset", validate(resetPasswordSchema), resetPassword);

router.post("/register", upload.single("picture"), multerErrorHandler(upload), validate(registerSchema), handleNewUser);

router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
