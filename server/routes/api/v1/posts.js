const express = require("express");

const router = express.Router();
const { getFeedPosts, getUserPosts, sharePost,getSinglePost, createPost, deletePost, updatePost } = require("@controllers/postsController");

router.route("/").post(createPost).get(getFeedPosts);
router.route("/:postId").get(getSinglePost).delete(deletePost).put(updatePost);
router.route("/:postId/share").post(sharePost);

module.exports = router;
