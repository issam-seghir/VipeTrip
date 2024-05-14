const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SocketSessionSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		socketId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("SocketSession", SocketSessionSchema);
