const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401).send("Missing or malformed Authorization header");
	const token = authHeader.split(" ")[1];

	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send("Server error: JWT secret not defined");
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.sendStatus(403);
		}
		// Attach user data to request object
		req.user = {
			id: decoded.id,
		};
		next();
	});
};

module.exports = verifyJWT;
