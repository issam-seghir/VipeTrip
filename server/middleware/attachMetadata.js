function attachMetadata(req, res, next) {
	req.metadata = {
		time: Date.now(),
		ip: req.ip,
		userAgent: req.headers["user-agent"],
	};
	next();
}

/* Usage :
 * const attachMetadata = require("./middleware/attachMetadata");
 * app.use(attachMetadata);
 *
 * app.get("/", (req, res) => {
 *     console.log(req.metadata);
 *      console.log('Request Time:', req.metadata.time);
 *     console.log('Client  IP:', req.metadata.ip);
 *    console.log('User Agent:', req.metadata.userAgent);
 *
 */

module.exports = attachMetadata;
