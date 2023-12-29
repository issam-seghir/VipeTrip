const express = require("express");

const router = express.Router();
const authController = require("@controllers/authController");
const registerController = require("@controllers/registerController");
const upload = require("@middleware/multerUploader");



router.post("/login", authController.handleLogin);
router.post("/register", upload.single("pic"), registerController.handleNewUser);

module.exports = router;
