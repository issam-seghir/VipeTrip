const express = require("express");

const router = express.Router();
const { handleLogout } = require("@root/controllers/auth/logoutController");

router.get("/", handleLogout);

module.exports = router;
