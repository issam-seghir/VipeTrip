// @ts-check

const mongoose = require("mongoose");
const { isProd } = require("@config/const");
const { ENV } = require("@/validations/envSchema");
const log = require("@/utils/chalkLogger");

const connectDB = async () => {
	try {
		await mongoose.connect(ENV.DATABASE_URI, { dbName: ENV.DATABASE_NAME, autoIndex: !isProd, autoCreate: !isProd });
	} catch (error) {
		log.error("mongoose connection : \n");
		console.error(error);
	}
};

module.exports = connectDB;
