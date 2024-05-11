const express = require("express");

const router = express.Router();
const { getAllUsers, getCurrentUser,getUserPosts, deleteUser, getUser, updateUser } = require("@controllers/usersController");
const { checkUserId } = require("@middleware/access/checkUserId");
const validate = require("express-zod-safe");
const { registerSchema } = require("@validations/authSchema");

router.route("/").get(getAllUsers).put(validate(registerSchema), updateUser).delete(deleteUser);
router.route("/me").get(getCurrentUser);
router.route("/:userId").get(getUser);

router.route("/me/posts").get(getUserPosts);
router.route("/:userId/posts").get(getUserPosts);

router.use("/friends", require("./friendShipt"));

module.exports = router;
