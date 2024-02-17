const log = require("@/utils/chalkLogger");


const errorHandler = (err, req, res, next) => {
	log.error("Server Error", "🧨🧨🧨");
	console.error(err.stack);
	res.status(500).send(err.message);
};

module.exports = errorHandler;
