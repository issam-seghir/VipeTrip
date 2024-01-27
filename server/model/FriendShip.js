const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendShipSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		friendId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: {
				values: ["Requested", "Accepted", "Declined"],
				message: "{VALUE} is not supported",
			},
			default: "Requested",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("FriendShip", friendShipSchema);
