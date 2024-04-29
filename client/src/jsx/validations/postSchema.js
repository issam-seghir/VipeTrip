import { stringNonEmpty, ObjectIdSchema } from "@utils/zodUtils";
import { z } from "zod";

//? -------- Constant ---------
const MAX_FILE_SIZE = 500_000;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

//? -------- Sub Schema ---------
const totalSchema = z.number().int().positive().default(0);

export const postSchema = z.object({
	author: ObjectIdSchema,
	privacy: z.enum(["onlyMe", "friends", "public"]).default("public"),
	description: stringNonEmpty().max(3000),
	images: z.instanceof(FileList).optional().or(z.literal("")), // fix optional for url / email ...,
	totalLikes: totalSchema,
	totalComments: totalSchema,
	totalShares: totalSchema,
	edited: z.boolean().default(false),
	mentions: z.array(ObjectIdSchema).max(50),
	tags: z.array(stringNonEmpty().max(20)).max(10), // Limit the length of each tag to 20 characters and the number of tags to 10
});
/**
 * @typedef {z.infer<typeof postSchema>} postSchemadBody
 */
