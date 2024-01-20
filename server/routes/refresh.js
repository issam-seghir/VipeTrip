const express = require("express");

const router = express.Router();
const refreshTokenController = require("@root/controllers/auth/refreshTokenController");

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
