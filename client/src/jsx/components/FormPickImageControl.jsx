import React, { useCallback, useState } from "react";
import { useController } from "react-hook-form";
import { getBase64 } from "@utils/getBase64";

// ? see : https://stackblitz.com/edit/input-file-react-hook-form?file=src%2FForm.js
// ? Usage


/* via control: */

/* <FormPickImageControl name="avatar2" errors={errors} control={control} />; */
// Zod :
/*   avatar: z
    .instanceof(FileList)
    .refine((val) => val.length > 0, 'File is required'),
 */

export default function PickAvatarControl({ name, errors, control }) {
	const { field } = useController({ name, control });
	const [image, setImage] = useState();

	const onAvatarChange = useCallback(async (event) => {
		if (event.target.files?.[0]) {
			const base64 = await getBase64(event.target.files[0]);

			setImage(base64);
			field.onChange(event.target.files);
		}
	}, []);

return (
    <div>
        <label htmlFor="fileInput">Any file (...control):</label>
        {image && <img src={image} width="100px" alt="img"/>}
        <input type="file" id="fileInput" onChange={onAvatarChange} />
        <p>{errors[name]?.message}</p>
    </div>
);
}
