import { stringNonEmpty } from "@utils/zodUtils";
import { z } from "zod";

//? -------- Constant ---------
const MAX_FILE_SIZE = 500_000;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

//? -------- REGEX ---------
const tagRegex = /^#?[\w-]+$/;

//? -------- Sub Schema ---------
const totalSchema = z.number().int().positive().default(0);

export const createPostSchema = z.object({
	privacy: z.enum(["onlyMe", "friends", "public"]).default("public"),
	description: stringNonEmpty().max(3000),
	images: z.instanceof(FileList).optional().or(z.literal("")), // fix optional for url / email ...,
	edited: z.boolean().default(false),
	mentions: z.array(z.string()).max(50).default([]),
	tags: z
		.array(
			z
				.string()
				.max(20)
				.regex(tagRegex, { message: "Tags can only contain letters, numbers, dashes (-), or underscores (_)" })
		)
		.max(10)
		.default([]), // Limit the length of each tag to 20 characters and the number of tags to 10
});
/**
 * @typedef {z.infer<typeof createPostSchema>} createPostSchemadBody
 */
