const express = require("express");

const router = express.Router();
const path = require("node:path");

router.get("/", (req, res) => {
	res.send("Hello World!");
});

module.exports = router;
