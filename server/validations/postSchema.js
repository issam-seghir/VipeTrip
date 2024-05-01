const { z } = require("zod");
const zu = require("zod_utilz");
const { stringNonEmpty, ObjectIdSchema } = require("@/utils/zodUtils");


//? -------- REGEX ---------
const tagRegex = /^#?[\w-]+$/;

//? -------- Sub Schema ---------
const totalSchema = z.number().int().positive().default(0);

const createPostSchema = {
	body: z.object({
		privacy: z.enum(["onlyMe", "friends", "public"]).default("public"),
		description: stringNonEmpty().max(3000),
		mentions: z.array(z.string()).max(50).default([]),
		tags: z
			.array(
				z
					.string()
					.max(20)
					.regex(tagRegex, {
						message: "Tags can only contain letters, numbers, dashes (-), or underscores (_)",
					})
			)
			.max(10)
			.default([]), // Limit the length of each tag to 20 characters and the number of tags to 10
	}),
};

/**
 * @typedef {z.infer<typeof createPostSchema.body>}createPostSchemaBody
 */

module.exports = { createPostSchema };
