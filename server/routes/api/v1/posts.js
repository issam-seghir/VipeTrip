const express = require("express");

const router = express.Router();
const {
	getAllPosts,
	getUserPosts,
	getPostLikers,
	likeDislikePost,
	sharePost,
	getSinglePost,
	createPost,
	deletePost,
	updatePost,
} = require("@controllers/postsController");
const multerErrorHandler = require("@/middleware/multer/multerErrorHandler");
const { upload, uploadPost } = require("@/middleware/multer/multerUploader");
const validate = require("express-zod-safe");
const { createPostSchema } = require("@validations/postSchema");

router
	.route("/")
	.post(uploadPost.array("images", 5), multerErrorHandler(upload), validate(createPostSchema), createPost);
router.route("/").get(getAllPosts);
router.route("/:postId").get(getSinglePost).delete(deletePost).put(updatePost);

router.route("/:postId/share").post(sharePost);
router.route("/:postId/likeDislike").post(likeDislikePost);
router.route("/:postId/likers").get(getPostLikers);

module.exports = router;
