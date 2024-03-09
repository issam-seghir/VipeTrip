// @ts-check

const z = require("zod");
const zu = require("zod_utilz");
const { stringNonEmpty, arrayFromString, formatPath } = require("@/utils/zodUtils");

//? -------- Constant ---------

const MAX_FILE_SIZE = 500_000;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

//? -------- REGEX ---------
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/;
const hexRegex = /[\da-f]{40}$/i;

//? -------- Sub Schema ---------
const credinalSchema = stringNonEmpty().trim().min(3).max(25);
const infoSchema = z.string().trim().min(3).max(25).optional();
const tokenSchema = stringNonEmpty()
	.length(40, { message: "must be a 40-character string" })
	.regex(hexRegex, { message: "must be a hexadecimal string" });

const registerSchema = {
	body: z.object({
		firstName: credinalSchema,
		lastName: credinalSchema,
		email: stringNonEmpty().email().trim().toLowerCase(),
		password: stringNonEmpty()
			.min(8)
			.max(20)
			.regex(
				passRegex,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!$%&*?@#)"
			),
		location: infoSchema,
		job: infoSchema,
	}),
};
/**
 * @typedef {z.infer<typeof registerSchema.body>} RegisterBody
 */

const loginSchema = {
	body: registerSchema.body.pick({ email: true, password: true }).extend({
		rememberMe: z.boolean().optional(),
	}),
};

/**
 * @typedef {z.infer<typeof loginSchema.body>} LoginBody
 */

const resetPasswordRequestSchema = {
	body: registerSchema.body.pick({ email: true }),
};

/**
 * @typedef {z.infer<typeof resetPasswordRequestSchema.body>} resetPasswordRequestBody
 */

const resetPasswordSchema = {
	body: registerSchema.body.pick({ password: true }),
	params: z.object({ token: tokenSchema }),
};

module.exports = { registerSchema, loginSchema, resetPasswordRequestSchema, resetPasswordSchema };
