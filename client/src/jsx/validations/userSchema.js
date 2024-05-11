import { baseSchema } from "@validations/authSchema";

import { stringNonEmpty } from "@utils/zodUtils";
import { z } from "zod";


export const userProfileSchema = baseSchema.pick({ firstName: true, lastName: true, location: true, job: true }).extend({
	profilePicture: z.string(),
	coverPicture: z.string(),
	bio: z.string().max(160, "Bio must be 160 characters or less"),
});
/**
 * @typedef {z.infer<typeof userProfileSchema>} userProfileBody
 */
