const createError = require("http-errors");

const checkUserId = (req, res, next) => {
	if (!req?.user?.id) {
		return next(new createError.BadRequest("User ID required"));
	}
	next();
};

module.exports = { checkUserId };
