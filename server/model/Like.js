const mongoose = require("mongoose");
const { normalize } = require("@utils/plugins");

const Schema = mongoose.Schema;

const likeSchema = new Schema(
	{
		liker: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likedComment: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
			autopopulate: true,
		},
		likedPost: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			autopopulate: true,
		},
		type: {
			type: String,
			enum: ["Post", "Comment"],
			required: true,
		},
	},
	{ timestamps: true }
);

//* Apply plugins

//? --------- Middlewares ----------------

// Middleware to increments totalLikes in Post or Comment when user add like to a Post or Comment
likeSchema.pre("save", async function () {
	try {
		if (this.type === "Post") {
			await this.model("Post").updateOne({ _id: this.likedPost }, { $inc: { totalLikes: 1 } });
		} else if (this.type === "Comment") {
			await this.model("Comment").updateOne({ _id: this.likedComment }, { $inc: { totalLikes: 1 } });
		}
	} catch (error) {
		console.log(error);
	}
});

// Middleware to decrements  totalLikes in Post or Comment when user remove  like from  Post or comment
likeSchema.pre("findOneAndDelete", async function () {
	const like = await this.model.findOne(this.getQuery());
	if (like.type === "Post") {
		await like.model("Post").updateOne({ _id: like.likedPost }, { $inc: { totalLikes: -1 } });
	} else if (like.type === "Comment") {
		await like.model("Comment").updateOne({ _id: like.likedComment }, { $inc: { totalLikes: -1 } });
	}
});

module.exports = mongoose.model("Like", likeSchema);
