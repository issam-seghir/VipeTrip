/* eslint-disable unicorn/better-regex */

// ----------------- Schema Validation ------------------
import { z } from "zod";

export const registerSchema = z
	.object({
		firstName: z.string().min(1, "This is a required field").trim().min(3).max(15),
		lastName: z.string().min(1, "This is a required field").min(3).max(15),
		email: z.string().min(1, "This is a required field").email().trim().toLowerCase().min(3).max(20),
		password: z
			.string()
			.min(1, "This is a required field")
			.min(8, "Password should be at least 8 characters")
			.max(100, "Password should not exceed 100 characters")
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@#])[\d!$%&*?@#A-Za-z]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!$%&*?@#)"),
		confirmPassword: z.string().min(1, "This is a required field"),
		location: z.string().max(100).optional(),
		job: z.string().max(100).optional(),
		picture: z.string().url({ message: "Picture must be a valid URL" }).optional().or(z.literal("")), // fix optional for url / email ...,
	})
	.refine((data) => data.password === data.confirmPassword, {
		//For advanced features - multiple issues ,  see (superRefine)
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const loginSchema = z.object({
	email: z.string().min(1, "This is a required field").trim().toLowerCase(),
	password: z.string().min(1, "This is a required field"),
});
