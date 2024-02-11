const mongoose = require("mongoose");
const { isProd } = require("@config/const");
const { ENV } = require("@/validations/envSchema");

const connectDB = async () => {
	try {
		await mongoose.connect(ENV.DATABASE_URI, { dbName: ENV.DATABASE_NAME, autoIndex: !isProd, autoCreate: !isProd });
	} catch (error) {
		console.error(error);
	}
};

module.exports = connectDB;
