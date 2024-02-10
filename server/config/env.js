/* eslint-disable unicorn/no-process-exit */
const zu = require("zod_utilz");
const z = require("zod");
const chalk = require("chalk");

const durationRegex = /^(\d+(\.\d+)?(ms|s|m|h|d|w|y))$/;
const hexRegex = /^[\da-f]{128}$/i;
const numberRegex = /^\d+$/;
const mongodbUriRegex = /^(mongodb:(?:\/{2})?)((?:\w+:\w+@)?[\w.-]+:\d{2,5}(?:\/\w+)?(?:\?[\w%&=-]+)?)/;
const testValue = "55a20441f1fadf0e865d3656000b04f4aaff69934a42f525ebbac0189eb21934d6d89e09315bb905fbab1f2b19362a5baf86224747e2c16c80b90458d34632e0";
const log = require("@config/ChalkLogger");

// console.log(hexRegex.test(testValue)); // Should print: true
const stringNonEmpty = z.string().min(1, { message: "cannot be empty" });
const tokenSchema = z;
stringNonEmpty.length(128, { message: "must be a 128-character string" }).regex(/[\da-f]{128}$/i, { message: "must be a hexadecimal string" });

const tokenExpireErrorMap = zu.makeErrorMap({
	invalid_string: (err) => `${err.data} : must be a duration string like "2h", "30m", "10s", etc. `,
});
const dataBaseURIErrorMap = zu.makeErrorMap({
	invalid_string: (err) => `${err.data} : must be a duration string like "2h", "30m", "10s", etc. `,
});

const numberSchema = z.coerce.number().int({ message: "must be integer number" }).positive({ message: "must be positive number" });
const tokenExpireSchema = z.string({ errorMap: tokenExpireErrorMap }).min(1, { message: "cannot be empty" }).regex(durationRegex);

const errorMap = zu.makeErrorMap({
	required: "is required",
	invalid_type: (err) => `${err.defaultError} : ${err.data}`,
	invalid_enum_value: ({ data, options }) => `${data} : is not a valid enum value. Valid options: ${options?.join(" | ")} `,
	too_small: (err) => `value ${err.data}  expected to be  >= ${err.minimum}`,
	too_big: (err) => `value ${err.data} : expected to be  <= ${err.maximum}`,
});
const PortRefineErrorMap = zu.makeErrorMap({
	custom: (err) => `${err.data} is not a valid port number. Must be a number between 0 and 65536`,
});

// global error map (for the whole schema)
z.setErrorMap(errorMap);

const envSchema = z.object({
	// ACCESS_TOKEN_SECRET: tokenSchema,
	// REFRESH_TOKEN_SECRET: tokenSchema,
	// ACCESS_TOKEN_SECRET_EXPIRE: tokenExpireSchema,
	// REFRESH_TOKEN_SECRET_EXPIRE: tokenExpireSchema,
	// COOKIE_MAX_AGE: z.preprocess((x) => x || undefined, numberSchema.min(60_000).default(60_000)),
	// DATABASE_URI: stringNonEmpty.regex(mongodbUriRegex, {
	// 	message: "must be a valid MongoDB URI",
	// }),
	// DATABASE_NAME: stringNonEmpty,
	// NODE_ENV: z.enum(["development", "production"]).default("development"),
	ALLOWED_ORIGINS: z.preprocess((origins) => (origins ? origins.split(",") : []), z.array(stringNonEmpty.url({ message: "must be a valid URL" })).default(["http://localhost:3000"])),
	// .nonempty({ message: "array cannot be empty" })
	PORT: z.preprocess((x) => x || undefined, numberSchema.min(1).max(65_536).default(3000)),
	// .refine((num) => num > 0 && num < 65_536, { errorMap: PortRefineErrorMap }),
	// SOME_BOOLEAN: z.enum(["true", "false"]).transform((v) => v === "true"),
});
// console.log(process.env.ALLOWED_ORIGINS);

function formatPath(path) {
	return path
		.map((element, index) => {
			if (Number.isInteger(element) && index > 0 && Number.isInteger(path[index - 1])) {
				// This is an array index, format it as such
				return `[${element}]`;
			} else {
				// This is not an array index, just convert it to a string
				return element.toString();
			}
		})
		.join(".");
}

let ENV;
try {
	// ENV = envSchema.parse(process.env);

	ENV = envSchema.parse({ PORT: 20, ALLOWED_ORIGINS: "" });
} catch (error) {
	if (error instanceof z.ZodError) {
		log.info("\n 💠💠💠💠💠💠 Environment variable validation error 💠💠💠💠💠💠\n");
		error.errors.forEach((err) => {
			const currentPath = formatPath(err.path);
			log.error(`* ${currentPath}  : ${err.message}`);
		});
		console.log("-------------");
	} else {
		log.error("An unexpected error occurred while validating environment variables 💥: \n", error);
	}
	process.exit(1);
}
console.log(ENV.ALLOWED_ORIGINS);

module.exports = { envSchema, ENV };

/* usage :
//*? server side: https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
//*? client side (vite): https://www.bing.com/videos/riverview/relatedvideo?&q=complex+example+with+zod+validator&&mid=371CBA211E2817D7EDB6371CBA211E2817D7EDB6&&FORM=VRDGAR

import { ENV } from "./env.ts";
import { zu } from "zod_utilz";

//* This will use be fully typed if using Typescript! Will also work for Javascript.
console.log(ENV.NODE_ENV);
*/
