const express = require("express");

const router = express.Router();
const { getFeedPosts, getUserPosts, likePost, createPost } = require("@controllers/postsController");

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);
router.post("/posts", createPost);

module.exports = router;
