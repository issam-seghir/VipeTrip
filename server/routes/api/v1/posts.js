const express = require("express");

const router = express.Router();
const { getFeedPosts, getUserPosts, sharePost, getSinglePost, createPost, deletePost, updatePost } = require("@controllers/postsController");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const { upload, uploadPost } = require("@/middleware/multer/multerUploader");
const validate = require("express-zod-safe");
const {
	createPostSchema
} = require("@validations/postSchema");

router.route("/").post( uploadPost.array("images", 5), createPost);
router.route("/").get(getFeedPosts);
router.route("/:postId").get(getSinglePost).delete(deletePost).put(updatePost);

router.route("/:postId/share").post(sharePost);

module.exports = router;
