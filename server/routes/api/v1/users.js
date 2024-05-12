const express = require("express");

const router = express.Router();
const {
	getAllUsers,
	getCurrentUser,
	getUserPosts,
	deleteUser,
	getUser,
	updateUser,
	updateUserProfile,
} = require("@controllers/usersController");
const { checkUserId } = require("@middleware/access/checkUserId");
const validate = require("express-zod-safe");
const { registerSchema } = require("@validations/authSchema");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const { upload } = require("@/middleware/multer/multerUploader");


router.route("/").get(getAllUsers).put(validate(registerSchema), updateUser).delete(deleteUser);
router.route("/me").get(getCurrentUser);
router.route("/me/posts").get(getUserPosts);
router.route("/me/profile").put(upload.array("images", 2), multerErrorHandler(upload), updateUserProfile);
// id routes must be the last one to passed correctly 
router.route("/:userId").get(getUser);
router.route("/:userId/posts").get(getUserPosts);



router.use("/friends", require("./friendShipt"));

module.exports = router;
