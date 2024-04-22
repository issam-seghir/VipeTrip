
const User = require("@model/User");
const Post = require("@model/Post");
const Comment = require("@model/Comment");


module.exports.isLogin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "YOU MUST BE LOGIN");
		return res.redirect("/login");
	}
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (user._id != req.user.id) {
		req.flash("error", "you donot have permission to do that");
		return res.redirect(`/profile/${id}`);
	}
	next();
};

module.exports.isPostAuthor = async (req, res, next) => {
	const { id } = req.body;
	const post = await Post.findById(id);
	const user = post.user;
	if (user._id != req.user.id) {
		req.flash("error", "you donot have permission to do that");
		return res.redirect(`/profile/${id}`);
	}
	next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
	const { cid } = req.params;
	const comment = await Comment.findById(cid);
	const user = comment.author;
	if (user._id != req.user.id) {
		req.flash("error", "you donot have permission to do that");
		return res.redirect(`/profile/${req.user.id}`);
	}
	next();
};

