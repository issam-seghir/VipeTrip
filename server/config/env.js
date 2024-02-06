const z = require("zod");

const durationRegex = /^(\d+(\.\d+)?(ms|s|m|h|d|w|y))$/;
const hexRegex = /^[\da-f]{128}$/i;
const numberRegex = /^\d+$/;
const mongodbUriRegex = /^(mongodb:(?:\/{2})?)((?:\w+:\w+@)?[\w.-]+:\d{2,5}(?:\/\w+)?(?:\?[\w%&=-]+)?)/;
const testValue = "55a20441f1fadf0e865d3656000b04f4aaff69934a42f525ebbac0189eb21934d6d89e09315bb905fbab1f2b19362a5baf86224747e2c16c80b90458d34632e0";

// console.log(hexRegex.test(testValue)); // Should print: true

const tokenSchema = z.coerce // Coerce the value to a string if it's not like : parse(1234) => "1234"
	.string({ message: "must be a string" })
    .includes("a")
	.length(128, { message: "must be a 128-character string" });
// .regex(/^[\da-f]{122}$/i, { message: "must be a 128-character hexadecimal string" });
const tokenExpireSchema = z.coerce // Coerce the value to a string if it's not like : parse(1234) => "1234"
	.string()
	.min(1)
	.regex(durationRegex, {
		errorMap: (error, ctx) => ({
			message: `'${error.path}' must be a duration string like "2h", "30m", "10s", etc. `,
		}),
	});

const envSchema = z.object({
	// ACCESS_TOKEN_SECRET: tokenSchema,
	// REFRESH_TOKEN_SECRET: tokenSchema,
	// ACCESS_TOKEN_SECRET_EXPIRE: tokenExpireSchema,
	// REFRESH_TOKEN_SECRET_EXPIRE: tokenExpireSchema,
	// COOKIE_MAX_AGE: z
	// 	.string()
	// 	.min(1000, { errorMap: (error, ctx) => ({ message: `'${error.path}' must be a number greater then 1000` }) })
	// 	.regex(numberRegex, {
	// 		errorMap: (error, ctx) => ({
	// 			message: `'${error.path}' must be a number`,
	// 		}),
	// 	})
	// 	.transform((num) => Number.parseInt(num)),
	// DATABASE_URI: z
	// 	.string()
	// 	.min(1)
	// 	.regex(mongodbUriRegex, {
	// 		errorMap: (error, ctx) => ({
	// 			message: `'${error.path}' must be a valid MongoDB URI`,
	// 		}),
	// 	}),
	// DATABASE_NAME: z.string().min(1),
	// NODE_ENV: z.enum(["development", "production"], { invalid_type_error: "only development or production are excepted" }).default("development"),
	// ALLOWED_ORIGINS: z.array(z.string()).transform((origins) => origins.split(",")),
	PORT: z
		.string()
		.min(1, { message: "PORT must not be empty" })
		.regex(numberRegex, { message: "PORT must be a number" })
		.default(3000)
		.transform((num) => Number.parseInt(num))
		.refine((num) => num > 0 && num < 65_536, {
			message: "PORT must be a positive integer between 1 and 65535",
		}),
	// SOME_BOOLEAN: z.enum(["true", "false"]).transform((v) => v === "true"),
});
console.log(process.env.ALLOWED_ORIGINS);
console.log(process.env.ALLOWED_ORIGINS);
console.log(process.env.ALLOWED_ORIGINS);

const ENV = envSchema.parse(process.env);
// !ENV.success && console.log(ENV.error.issues.map((x) => x.message));

module.exports = { envSchema, ENV };

/* usage :
//*? server side: https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
//*? client side (vite): https://www.bing.com/videos/riverview/relatedvideo?&q=complex+example+with+zod+validator&&mid=371CBA211E2817D7EDB6371CBA211E2817D7EDB6&&FORM=VRDGAR

import { ENV } from "./env.ts";

//* This will use be fully typed if using Typescript! Will also work for Javascript.
console.log(ENV.NODE_ENV);
*/
