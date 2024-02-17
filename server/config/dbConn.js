// @ts-check

const mongoose = require("mongoose");
const { isProd } = require("@config/const");
const { ENV } = require("@/validations/envSchema");
const log = require("@/utils/chalkLogger");

const options = { dbName: ENV.DATABASE_NAME, autoIndex: !isProd, autoCreate: !isProd };
const connectDB = async () => {
	try {
		await mongoose.connect(ENV.DATABASE_URI, options);
	} catch (error) {
		log.error("mongoose connection : \n");
		console.error(error);
	}
};

var mongo_db_rt = mongoose.createConnection(ENV.DATABASE_URI, options);

async function DB_wait(db) {
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	/*
    0: disconnected
    1: connected
    2: connecting
    3: disconnecting
    */
	var state = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
	while (db.readyState !== 1) {
		console.log(`Waiting for connection on db: ${db.name} | State: ${state[db.readyState]}`);
		await sleep(1000);
	}
	console.log(`Connection established with: ${db.name} | State: ${state[db.readyState]}`);
	return db;
}
var mongo_ratelimit = DB_wait(mongo_db_rt); // this assigns the variable into an unresolved promise

module.exports = { connectDB, mongo_ratelimit };
