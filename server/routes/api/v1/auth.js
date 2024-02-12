const express = require("express");

const router = express.Router();
const { handleLogin } = require("@/controllers/auth/loginController");
const { handleNewUser } = require("@/controllers/auth/registerController");
const { handleLogout } = require("@/controllers/auth/logoutController");
const { handleRefreshToken } = require("@/controllers/auth/refreshTokenController");
const {upload} = require("@/middleware/multer/multerUploader");


router.post("/login", handleLogin);
router.post("/register", upload.single("picture"), handleNewUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogout);

module.exports = router;
