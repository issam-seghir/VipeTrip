const { z } = require("zod");
const { mongooseIdSchema } = require("@validations/mongooseIdSchema");

const postSchema = z.object({
	userId: mongooseIdSchema,
	sharedFrom: mongooseIdSchema,
	description: z.string().max(500),
	attachments: z.array(z.string().url()).max(10),
	totalLikes: z.number().int().positive(),
	totalComments: z.number().int().positive(),
	totalShares: z.number().int().positive(),
	edited: z.boolean(),
	mentions: z.array(mongooseIdSchema).max(50),
	tags: z.array(z.string().max(20)).max(10), // Limit the length of each tag to 20 characters and the number of tags to 10
});

module.exports = postSchema;
