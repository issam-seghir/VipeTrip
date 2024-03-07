const express = require("express");

const router = express.Router();
const { handleLogin, checkEmailExists } = require("@/controllers/auth/loginController");
const { handleNewUser } = require("@/controllers/auth/registerController");
const { handleLogout } = require("@/controllers/auth/logoutController");
const { handleRefreshToken } = require("@/controllers/auth/refreshTokenController");
const { upload } = require("@/middleware/multer/multerUploader");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const validate = require("express-zod-safe");
const { registerSchema, loginSchema } = require("@validations/authSchema");

router.post("/login", validate(loginSchema), handleLogin);
router.get("/check-email", checkEmailExists);
router.post("/register", upload.single("picture"), multerErrorHandler(upload), validate(registerSchema), handleNewUser);

router.get("/refresh", handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;
