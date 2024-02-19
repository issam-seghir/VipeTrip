const express = require("express");

const router = express.Router();
const { upload, uploadPost } = require("@/middleware/multer/multerUploader");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");

// testing multer
router.post("/upload", upload.array("picture", 2), multerErrorHandler(upload), (req, res) => {
	res.status(200).send("pictures uploaded");
});
router.post("/uploadPost", uploadPost.array("picture", 3), multerErrorHandler(uploadPost), (req, res) => {
	res.status(200).send("picture for posts  uploaded");
});

module.exports = router;
