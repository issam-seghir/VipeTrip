const mongoose = require("mongoose");
const { isProd } = require("@config/const");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI, { dbName: process.env.DATABASE_NAME, autoIndex: !isProd, autoCreate: !isProd });
	} catch (error) {
		console.error(error);
	}
};

module.exports = connectDB;
