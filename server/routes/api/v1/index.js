const express = require("express");

const router = express.Router();
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const verifyJWT = require("@/middleware/auth/verifyJWT");
const { upload, uploadPost } = require("@/middleware/multer/multerUploader");

// Route for testing
// router.post("/upload", upload.array("picture", 2), multerErrorHandler(upload), (req, res) => {
// 	res.status(200).send("File uploaded");
// });
// router.post("/uploadPost", uploadPost.array("picture", 3), multerErrorHandler(uploadPost), (req, res) => {
// 	res.status(200).send("File uploaded");
// });

//* Public routes
//? Authentication : who the user is
router.use("/auth", require("./auth"));

//? Authorization: what the user is allowed to access
//* Protected routes : will check for a valid JWT in the Authorization header, (Authorization: Bearer <token>)
//*  and if it's present, the user will be allowed to access
// router.use(verifyJWT);
// router.use("/users", require("./users"));
// router.use("/posts", upload.array("picture", 25), require("./posts"));

module.exports = router;
