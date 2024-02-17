// @ts-check

const z = require("zod");
const zu = require("zod_utilz");
const { stringNonEmpty, arrayFromString, formatPath } = require("@/utils/zodUtils");

//? -------- REGEX ---------
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/;

//? -------- Sub Schema ---------
const credinalSchema = stringNonEmpty().trim().min(3).max(15);
const infoSchema = z.string().trim().min(3).max(15).optional();

const registerSchema = z.object({
	body: z.object({
		firstName: credinalSchema,
		lastName: credinalSchema,
		email: stringNonEmpty().email().trim().toLowerCase(),
		password: stringNonEmpty().min(8).max(15).regex(passRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!$%&*?@#)"),
		location: infoSchema,
		job: infoSchema,
	}),
	// file: z.object({
	// 	picture: z
	// 		.object({
	// 			fieldname: z.string(),
	// 			originalname: z.string(),
	// 			encoding: z.string(),
	// 			mimetype: z.string(),
	// 			size: z.number(),
	// 			destination: z.string(),
	// 			filename: z.string(),
	// 			path: z.string(),
	// 			buffer: z.instanceof(Buffer).optional(),
	// 		})
	// 		.optional(),
	// }),
	// params: z.object({
	// 	urlParameter: z.string(),
	// }),
	// query: z.object({
	// 	queryKey: z.string().length(64),
	// }),
});

module.exports = { registerSchema };
