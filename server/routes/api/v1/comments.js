const express = require("express");

const router = express.Router({ mergeParams: true });
const {
	createComment,
	getAllComments,
	deleteComment,
	updateComment,
	likeDislikeComment,
    createReply
} = require("@/controllers/commentController");

const validate = require("express-zod-safe");
const { commentSchema } = require("@validations/commentSchema");

router.route("/").post(createComment).get(getAllComments);

router.route("/:commentId").delete(deleteComment).put(updateComment);

router.route("/:commentId/likeDislike").post(likeDislikeComment);
router.route("/:commentId/reply").post(createReply);

module.exports = router;
