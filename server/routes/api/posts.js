const express = require("express");

const router = express.Router();
const { getFeedPosts, getUserPosts, likePost} = require("@controllers/postsController");

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);

module.exports = router;
