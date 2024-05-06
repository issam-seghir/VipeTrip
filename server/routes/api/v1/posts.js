const express = require("express");

const router = express.Router();
const {
	getAllPosts,
	getUserPosts,
	getPostLikers,
	likeDislikePost,
	repostPost,
	bookmarkPost,
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

router.route("/:postId/repost").post(repostPost);
router.route("/:postId/likeDislike").post(likeDislikePost);
router.route("/:postId/likers").get(getPostLikers);
router.route("/:postId/bookmark").post(bookmarkPost);

module.exports = router;
