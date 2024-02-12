import { z } from "zod";

const registerSchema = z.object({
	body: z.object({
		fullName: z.string({
			required_error: "Full name is required",
		}),
		email: z
			.string({
				required_error: "Email is required",
			})
			.email("Not a valid email"),
	}),
	params: z.object({
		urlParameter: z.string(),
	}),
	query: z.object({
		queryKey: z.string().length(64),
	}),
});

module.exports = { registerSchema };
