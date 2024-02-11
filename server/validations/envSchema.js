/* eslint-disable unicorn/no-process-exit */
// @ts-check

const zu = require("zod_utilz");
const z = require("zod");
const TypeOf = require("zod");
const { isRegexSave } = require("@/utils");
const createError = require("http-errors");
const log = require("@/utils/chalkLogger");
const { stringNonEmpty, arrayFromString, formatPath } = require("@/utils/zodUtils");

//? -------- REGEX ---------
const durationRegex = /^(\d+(\.\d+)?(ms|s|m|h|d|w|y))$/;
const hexRegex = /[\da-f]{128}$/i;
const mongodbUriRegex = /mongodb?([+rsv]*):\/\/(?:(?<login>[^#/:?@[\]]+)(?::(?<password>[^#/:?@[\]]+))?@)?(?<host>[\w.\-]+(?::\d+)?(?:,[\w.\-]+(?::\d+)?)*)(?:\/(?<dbname>[\w.\-]+))?(?:\?(?<query>[\w.\-]+=[\w.\-]+(?:&[\w.\-]+=[\w.\-]+)*))?/;

// const result = isRegexSave(durationRegex, hexRegex, mongodbUriRegex);
// if (!result.allSafe) {
// 	result.unsafeRegexes.forEach((regex) => {
// 		log.error("Unsafe regex:", regex);
// 	});
// 	throw createError(500, "One or more regular expressions are not safe.");
// }

//? -------- Error Maps ---------

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

const tokenExpireErrorMap = zu.makeErrorMap({
	invalid_string: (err) => `${err.data} : must be a duration string like "2h", "30m", "10s", etc. `,
});

//? -------- Sub Schema ---------
const tokenSchema = stringNonEmpty().length(128, { message: "must be a 128-character string" }).regex(hexRegex, { message: "must be a hexadecimal string" });
const tokenExpireSchema = stringNonEmpty(tokenExpireErrorMap).regex(durationRegex);
const numberSchema = z.coerce.number().int({ message: "must be integer number" }).positive({ message: "must be positive number" });

//? -------- Zod Global Config ---------

// global error map (for the whole schema)
z.setErrorMap(errorMap);

/*
	//*  see : https://catalins.tech/validate-environment-variables-with-zod/
	//* for typescript OR next js ( add type , autocomplete for ENV , process.env)
	declare global {
		namespace NodeJS {
		interface ProcessEnv extends TypeOf<typeof zodEnv> {}
		}
	}
*/

/**
 * @typedef {z.infer<typeof envSchema>} Env
 */

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
	// @ts-ignore
	ALLOWED_ORIGINS: arrayFromString(z.string().url(), ["http://localhost:3000"]),
	PORT: z.preprocess((x) => x || undefined, numberSchema.min(1).max(65_536).default(3000)),
});

/** @type {Env} */
let ENV;
try {
	// ENV = envSchema.parse(process.env);
	// for testing purposes
	ENV = envSchema.parse({ ALLOWED_ORIGINS: "http://127.0.0.1:5500,http://localhost:3000,http://localhost:3500", PORT: 52, DATABASE_NAME: "mydb", DATABASE_URI: "mongodb://localhost:27017/mydb" });
} catch (error) {
	if (error instanceof z.ZodError) {
		log.info("\n 💠💠💠💠💠💠 Environment variable validation error 💠💠💠💠💠💠\n");
		error.errors.forEach((err) => {
			const currentPath = formatPath(err.path);
			log.error(`* ${currentPath}  : `, `${err.message}`);
			console.log("-------------");
		});
		throw createError(500, "Environment variable validation error");
	} else {
		log.error("An unexpected error occurred while validating environment variables 💥: \n", error);
		throw createError(500, "Unexpected error", { error });
	}
}

module.exports = { envSchema, ENV };
