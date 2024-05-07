const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");


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
const { uploadPost } = require("@/middleware/multer/multerUploader");
const validate = require("express-zod-safe");
const { createPostSchema } = require("@validations/postSchema");
const { createComment, getAllComments, deleteComment, updateComment } = require("@/controllers/commentController");

router
	.route("/")
	.post(uploadPost.array("images", 5), multerErrorHandler(uploadPost), validate(createPostSchema), createPost);
router.route("/").get(getAllPosts);
router
	.route("/:postId")
	.get(getSinglePost)
	.delete(deletePost)
	.put(uploadPost.array("images", 5), multerErrorHandler(uploadPost), updatePost);

router.route("/:postId/repost").post(repostPost);
router.route("/:postId/likeDislike").post(likeDislikePost);
router.route("/:postId/likers").get(getPostLikers);
router.route("/:postId/bookmark").post(bookmarkPost);

// comments
router.use('/:postId/comments', commentsRouter); // Use the comments router as middleware

module.exports = router;
