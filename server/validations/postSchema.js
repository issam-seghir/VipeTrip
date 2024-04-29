const { z } = require("zod");
const zu = require("zod_utilz");
const { stringNonEmpty, ObjectIdSchema } = require("@/utils/zodUtils");

//? -------- Sub Schema ---------
const totalSchema = z.number().int().positive().default(0);

const postSchema = {
	body: z.object({
		author: ObjectIdSchema,
		privacy: z.enum(["onlyMe", "friends", "public"]).default("public"),
		description: stringNonEmpty().max(3000),
		images: z.array(stringNonEmpty().url()).max(10).optional(),
		totalLikes: totalSchema,
		totalComments: totalSchema,
		totalShares: totalSchema,
		edited: z.boolean().default(false),
		mentions: z.array(ObjectIdSchema).max(50),
		tags: z.array(stringNonEmpty().max(20)).max(10), // Limit the length of each tag to 20 characters and the number of tags to 10
	}),
};

/**
 * @typedef {z.infer<typeof postSchema.body>} postSchemadBody
 */

module.exports = { postSchema };
