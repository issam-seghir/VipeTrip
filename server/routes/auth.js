const express = require("express");

const router = express.Router();
const { handleLogin } = require("@controllers/loginController");
const { handleNewUser } = require("@controllers/registerController");
const {upload} = require("@middleware/multerUploader");



router.post("/login", handleLogin);
router.post("/register", upload.single("picture"), handleNewUser);

module.exports = router;
