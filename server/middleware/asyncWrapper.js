// async wrapper for express route handlers to catch errors and avoid try/catch blocks in controllers

function asyncWrapper(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch(next);
	};
}

module.exports = asyncWrapper;
