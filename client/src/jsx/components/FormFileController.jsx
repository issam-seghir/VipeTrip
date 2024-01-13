import { useCallback, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { getBase64 } from "@utils/getBase64";

// ? see : https://stackblitz.com/edit/input-file-react-hook-form?file=src%2FForm.js
// ? Usage


/* via useController:*/

/*     <FileController
        name="image"
        control={control}
        defaultValue={defaultValues.image}
        render={({ field, base64, remove, select }) => (
            <div>
                <label>Any file (...useController):</label>
                {base64 ? (
                    <Fragment>
                        <img src={base64} width="100px" />
                        <button onClick={remove}>remove</button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <input {...field} />
                        <br />
                        <button onClick={select}>select</button>
                        &nbsp;&lt;--- alternative (if input is hidden)
                    </Fragment>
            )}
                <p>{errors[field.name]?.message}</p>
            </div>
        )}
        />
*/

// Zod :
/*   avatar: z
    .instanceof(File),
    .refine((val) => val.length > 0, 'File is required'),

    const defaultValues = {
        image: new File([], 'https://picsum.photos/100'),
    };
 */

export default function FileController({ name, control, defaultValue, render }) {
	const inputRef = useRef(null);
	const { setValue } = useFormContext();
	const { field } = useController({ name, control });
	const [base64, setBase64] = useState(defaultValue.name);

	const onChange = useCallback(async (event) => {
		if (event.target.files?.[0]) {
			setBase64(await getBase64(event.target.files[0]));
			field.onChange(event.target.files[0]);
		}
	}, []);

	return render({
		field: {
			type: "file",
			name,
			onChange,
			ref: (instance) => {
				field.ref(instance);
				inputRef.current = instance;
			},
		},
		base64,
		select: () => inputRef.current?.click(),
		remove: () => {
			setValue(name, null);
			setBase64(null);
		},
	});
}
