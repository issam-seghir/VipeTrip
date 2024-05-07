const express = require("express");

const router = express.Router({ mergeParams: true });
const { createComment, getAllComments, deleteComment, updateComment } = require("@/controllers/commentController");

const validate = require("express-zod-safe");
const { commentSchema } = require("@validations/commentSchema");

router.route("/").post( createComment).get(getAllComments);

router.route("/:commentId").delete(deleteComment).put(updateComment);

// router.route("/:commentId/likeDislike").post(likeDislikeComment);
// router.route("/:commentId/likers").get(getCommentLikers);

module.exports = router;
