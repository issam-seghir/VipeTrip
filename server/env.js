import z from "zod";

const durationRegex = /^(\d+(\.\d+)?(ms|s|m|h|d|w|y))$/;
const hexRegex = /^[\da-f]{128}$/;
const numberRegex = /^\d+$/;

const envSchema = z.object({
	ACCESS_TOKEN_SECRET: z.string().min(1).regex(hexRegex, { message: "ACCESS_TOKEN_SECRET must be a 128-character hexadecimal string" }),
	REFRESH_TOKEN_SECRET: z.string().min(1).regex(hexRegex, { message: "REFRESH_TOKEN_SECRET must be a 128-character hexadecimal string" }),
	ACCESS_TOKEN_SECRET_EXPIRE: z.string().min(1).regex(durationRegex, { message: 'ACCESS_TOKEN_SECRET_EXPIRE must be a duration string like "2h", "30m", "10s", etc.' }),
	REFRESH_TOKEN_SECRET_EXPIRE: z
		.string()
		.min(1)
		.refine((expire) => durationRegex.test(expire), {
			message: 'REFRESH_TOKEN_SECRET_EXPIRE must be a duration string like "2h", "30m", "10s", etc.',
		}),
	DATABASE_URI: z.string().min(1),
	DATABASE_NAME: z.string().min(1),
	COOKIE_MAX_AGE: z
		.string()
		.min(1)
		.regex(numberRegex)
		.transform((num) => Number.parseInt(num)),
	ALLOWED_ORIGINS: z.array(z.string()).transform((origins) => origins.split(",")),
	PORT: z
		.string()
		.min(1)
		.regex(numberRegex)
		.positive()
		.max(65_536, `options.port should be >= 0 and < 65536`)
		.default(3000)
		.transform((num) => Number.parseInt(num)),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	SOME_BOOLEAN: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export const ENV = envSchema.parse(process.env);

/* usage :
//*? https://jfranciscosousa.com/blog/validating-environment-variables-with-zod/

import { ENV } from "./env.ts";

//* This will use be fully typed if using Typescript! Will also work for Javascript.
console.log(ENV.NODE_ENV);
*/
