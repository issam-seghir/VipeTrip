const mongoose = require("mongoose");
const z = require("zod");

const mongooseIdSchema = z.string().refine((val) => {
		return mongoose.Types.ObjectId.isValid(val);
	});

module.exports = { mongooseIdSchema };
