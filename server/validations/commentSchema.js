const { createPostSchema } = require('./postSchema');

const commentSchema = {
	body: createPostSchema.body.pick({ description: true, mentions: true }),
};

/**
 * @typedef {z.infer<typeof commentSchema.body>}commentSchemaBody
 */


module.exports = { commentSchema };
