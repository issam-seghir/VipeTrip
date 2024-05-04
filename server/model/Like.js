const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		commentId: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
		postId: {
			type: Schema.Types.ObjectId,
			ref: "Post",
		},
		type: {
			type: String,
			enum: ["Post", "Comment"],
			required: true,
		},
	},
	{ timestamps: true }
);

//? --------- Middlewares ----------------

// Middleware to increments totalLikes in Post or Comment when user add like to a Post or Comment
likeSchema.pre("save", function (next) {
	if (this.type === "Post") {
		this.model("Post").updateOne({ _id: this.postId }, { $inc: { totalLikes: 1 } }, next);
	} else if (this.type === "Comment") {
		this.model("Comment").updateOne({ _id: this.commentId }, { $inc: { totalLikes: 1 } }, next);
	} else {
		next();
	}
});

// Middleware to decrements  totalLikes in Post or Comment when user remove  like from  Post or comment
likeSchema.pre("remove", function (next) {
	if (this.type === "Post") {
		this.model("Post").updateOne({ _id: this.postId }, { $inc: { totalLikes: -1 } }, next);
	} else if (this.type === "Comment") {
		this.model("Comment").updateOne({ _id: this.commentId }, { $inc: { totalLikes: -1 } }, next);
	} else {
		next();
	}
});

module.exports = mongoose.model("Like", likeSchema);
