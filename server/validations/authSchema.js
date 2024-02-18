// @ts-check

const z = require("zod");
const zu = require("zod_utilz");
const { stringNonEmpty, arrayFromString, formatPath } = require("@/utils/zodUtils");

//? -------- REGEX ---------
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/;

//? -------- Sub Schema ---------
const credinalSchema = stringNonEmpty().trim().min(3).max(25);
const infoSchema = z.string().trim().min(3).max(25).optional();

const registerSchema = {
	body: z.object({
		firstName: credinalSchema,
		lastName: credinalSchema,
		email: stringNonEmpty().email().trim().toLowerCase(),
		password: stringNonEmpty().min(8).max(20).regex(passRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!$%&*?@#)"),
		location: infoSchema,
		job: infoSchema,
	})
}
/**
 * @typedef {z.infer<typeof registerSchema.body>} RegisterBody
 */


module.exports = { registerSchema };
