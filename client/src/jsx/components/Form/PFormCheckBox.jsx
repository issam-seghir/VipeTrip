/* eslint-disable jsx-a11y/label-has-associated-control */
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

export function PFormCheckBox({
	control,
	defaultValue = true,
	name,
	label,
	icon,
	errorMessage,
	disabled = false,
}) {
	const getFormErrorMessage = (name) => {
		return errorMessage[name] ? (
			<small className="p-error">{errorMessage[name].message}</small>
		) : (
			<small className="p-error">&nbsp;</small>
		);
	};

	return (
		<Controller
			defaultValue={defaultValue} // rules={{ required: "Name - Surname is required." }}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<>
					<Checkbox
						inputId={field.name}
						checked={field.value}
						inputRef={field.ref}
						icon={icon}
						className={classNames({ "p-invalid": fieldState.error }, "mr-2")}
						disabled={disabled}
						onChange={(e) => field.onChange(e.checked)}
					/>
					<label htmlFor={field.name} className="md:text-base text-xs">
						{label}
					</label>
					{/* error label */}
					<label htmlFor={field.name} className={classNames({ "p-error": errorMessage || fieldState.error })}>
						{getFormErrorMessage(field.name)}
					</label>
				</>
			)}
		/>
	);
}
