import { baseSchema } from "@validations/authSchema";

import { stringNonEmpty } from "@utils/zodUtils";
import { z } from "zod";


export const userProfileSchema = baseSchema.pick({ firstName: true, lastName: true, location:true,job:true }).extend({
	profilePicture: z.string().optional(),
    coverPicture: z.string().optional(),
});
/**
 * @typedef {z.infer<typeof userProfileSchema>} userProfileBody
 */
