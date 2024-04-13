/* eslint-disable unicorn/better-regex */

import { stringNonEmpty } from "@utils/zodUtils";
import { z } from "zod";

//? -------- Constant ---------
const MAX_FILE_SIZE = 500_000;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

//? -------- REGEX ---------
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/;

//? -------- Sub Schema ---------
const credinalSchema = stringNonEmpty().trim().min(3).max(25);
const infoSchema = z.string().trim().min(3).max(25).optional();
const passSchema = stringNonEmpty()
	.min(8, "Password must contain at least 8 character(s)")
	.max(20, "Password must contain at most 20 character(s)")
	.regex(
		passRegex,
		"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!$%&*?@#)"
	);



const baseSchema = z
	.object({
		firstName: credinalSchema,
		lastName: credinalSchema,
		email: stringNonEmpty().email().trim().toLowerCase(),
		password: passSchema,
		confirmPassword: passSchema,
		location: infoSchema,
		job: infoSchema,
		picture: z.instanceof(FileList).optional().or(z.literal("")), // fix optional for url / email ...,
	})

export const registerSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
	//For advanced features - multiple issues ,  see (superRefine)
	message: "Passwords do not match",
	path: ["confirmPassword"],
});
/**
 * @typedef {z.infer<typeof registerSchema>} RegisterBody
 */

export const loginSchema = baseSchema.pick({ email: true, password: true }).extend({
	rememberMe: z.boolean().optional(),
});
/**
 * @typedef {z.infer<typeof loginSchema>} LoginBody
 */

export const passwordResetReaquestSchema = baseSchema.pick({ email: true });
/**
 * @typedef {z.infer<typeof passwordResetReaquestSchema>} passwordResetReaquestBody
 */
export const passwordResetSchema = baseSchema
	.pick({ password: true, confirmPassword: true })
	.refine((data) => data.password === data.confirmPassword, {
		//For advanced features - multiple issues ,  see (superRefine)
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});;
/**
 * @typedef {z.infer<typeof passwordResetSchema>} passwordResetBody
 */
