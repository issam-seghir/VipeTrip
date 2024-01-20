const express = require("express");

const router = express.Router();
const { getFeedPosts, getUserPosts,getSinglePost, createPost, deletePost, updatePost } = require("@controllers/postsController");

/* READ */
router.route("/").post(createPost).get(getFeedPosts);
router.route("/:postId").get(getSinglePost).delete(deletePost).put(updatePost);


module.exports = router;
