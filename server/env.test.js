const { envSchema } = require("./config/env.js");

const mockEnv = {
	ACCESS_TOKEN_SECRET: "a".repeat(128), // 128-character hexadecimal string
	REFRESH_TOKEN_SECRET: "b".repeat(128), // 128-character hexadecimal string
	ACCESS_TOKEN_SECRET_EXPIRE: "2h", // duration string like "2h", "30m", "10s", etc.
	REFRESH_TOKEN_SECRET_EXPIRE: "2h", // duration string like "2h", "30m", "10s", etc.
	DATABASE_URI: "mongodb://localhost:27017/mydb", // valid MongoDB URI
	DATABASE_NAME: "mydb", // any non-empty string
	COOKIE_MAX_AGE: "2000", // any non-empty string that can be parsed to a number
	ALLOWED_ORIGINS: "http://localhost:3000,http://example.com", // comma-separated list of origins
	PORT: "3000", // any non-empty string that can be parsed to a number and is between 0 and 65536
	NODE_ENV: "development", // "development" or "production"
};

// try {
//     envSchema.parse(mockEnv);
// 	// const validatedEnv = envSchema.parse(mockEnv);
// 	// console.log(validatedEnv);
// } catch (error) {
// 	console.error(error);
// }
