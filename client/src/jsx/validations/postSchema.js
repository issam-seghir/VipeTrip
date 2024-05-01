import { stringNonEmpty} from "@utils/zodUtils";
import { z } from "zod";
import { byteToMb } from "@utils/index.js";
//? -------- Constant ---------
const MAX_FILES = 5; // Set your limit
const MAX_FILE_SIZE = 0.5;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

	/* 	.optional()
		.or(z.literal("")) // fix optional for url / email / instanseOf / custome  ..., */
//? -------- REGEX ---------
const tagRegex = /^#?[\w-]+$/;

//? -------- Sub Schema ---------
const totalSchema = z.number().int().positive().default(0);

export const createPostSchema = z.object({
	privacy: z.enum(["onlyMe", "friends", "public"]).default("public"),
	description: stringNonEmpty().max(3000),
	images: z
		.array(z.instanceof(File))
		.max(MAX_FILES, `Maximum number of Images exceeded. Limit is ${MAX_FILES}.`)
		.default([])
		.refine(
			(files) => files?.every((file) => byteToMb(file.size) <= MAX_FILE_SIZE),
			`Image size should be ⩽  ${MAX_FILE_SIZE} Mb.`
		)
		.refine(
			(files) => files?.every((file) => ACCEPTED_IMAGE_TYPES.has(file.type)),
			"Only these types are allowed .jpg, .jpeg, .png and .webp"
		),
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
