const express = require("express");

const router = express.Router();
const { handleLogin } = require("@root/controllers/auth/loginController");
const { handleNewUser } = require("@root/controllers/auth/registerController");
const {upload} = require("@middleware/multerUploader");



router.post("/login", handleLogin);
router.post("/register", upload.single("picture"), handleNewUser);

module.exports = router;
