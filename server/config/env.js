/* eslint-disable unicorn/no-process-exit */
const zu = require("zod_utilz");
const z = require("zod");
const log = require("@config/ChalkLogger");
const chalk = require("chalk");
const { stringNonEmpty, arrayFromString } = require("@utils");


//? -------- REGEX ---------
const durationRegex = /^(\d+(\.\d+)?(ms|s|m|h|d|w|y))$/;
const hexRegex = /[\da-f]{128}$/i;
const numberRegex = /^\d+$/;
const mongodbUriRegex = /^(mongodb:(?:\/{2})?)((?:\w+:\w+@)?[\w.-]+:\d{2,5}(?:\/\w+)?(?:\?[\w%&=-]+)?)/;

//? -------- error maps ---------
const tokenExpireErrorMap = zu.makeErrorMap({
	invalid_string: (err) => `${err.data} : must be a duration string like "2h", "30m", "10s", etc. `,
});

//? -------- sub schema ---------
const tokenSchema = stringNonEmpty().length(128, { message: "must be a 128-character string" }).regex(hexRegex, { message: "must be a hexadecimal string" });
const tokenExpireSchema = stringNonEmpty(tokenExpireErrorMap).regex(durationRegex);
const numberSchema = z.coerce.number().int({ message: "must be integer number" }).positive({ message: "must be positive number" });



const errorMap = zu.makeErrorMap({
	required: "is required",
	invalid_string: (err) => {
		if (err.validation === "url") {
			return `(${err.data}) must be a valid URL`;
		} else if (err.validation === "email") {
			return `(${err.data}) must be a valid email`;
		}
	},
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
	ACCESS_TOKEN_SECRET: tokenSchema,
	REFRESH_TOKEN_SECRET: tokenSchema,
	ACCESS_TOKEN_SECRET_EXPIRE: tokenExpireSchema,
	REFRESH_TOKEN_SECRET_EXPIRE: tokenExpireSchema,
	COOKIE_MAX_AGE: z.preprocess((x) => x || undefined, numberSchema.min(60_000).default(60_000)),
	DATABASE_URI: stringNonEmpty().regex(mongodbUriRegex, {
		message: "must be a valid MongoDB URI",
	}),
	DATABASE_NAME: stringNonEmpty(),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	ALLOWED_ORIGINS: arrayFromString(z.string().url(), ["http://localhost:3000"]),
	PORT: z.preprocess((x) => x || undefined, numberSchema.min(1).max(65_536).default(3000)),
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
	ENV = envSchema.parse(process.env);
	// for testing purposes
	// ENV = envSchema.parse({ ALLOWED_ORIGINS: "http://127.0.0.1:5500,http://localhost:3000,http://localhost:3500", PORT: 52, DATABASE_NAME: "mydb", DATABASE_URI: "mongodb://localhost:27017/mydb" });
} catch (error) {
	if (error instanceof z.ZodError) {
		log.info("\n 💠💠💠💠💠💠 Environment variable validation error 💠💠💠💠💠💠\n");
		error.errors.forEach((err) => {
			const currentPath = formatPath(err.path);
			log.error(`* ${currentPath}  : `, `${err.message}`);
			console.log("-------------");
		});
	} else {
		log.error("An unexpected error occurred while validating environment variables 💥: \n", error);
	}
	process.exit(1);
}

module.exports = { envSchema, ENV };

/* usage :
//*? server side: https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/
//*? client side (vite): https://www.bing.com/videos/riverview/relatedvideo?&q=complex+example+with+zod+validator&&mid=371CBA211E2817D7EDB6371CBA211E2817D7EDB6&&FORM=VRDGAR

import { ENV } from "./env.ts";
import { zu } from "zod_utilz";

//* This will use be fully typed if using Typescript! Will also work for Javascript.
console.log(ENV.NODE_ENV);
*/
