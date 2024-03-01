/* eslint-disable jsx-a11y/label-has-associated-control */
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

export function PFormTextField({ control, defaultValue = "", name, label, type = "text", size, iconStart, iconEnd,errorMessage, reset, disabled = false }) {
	const errorMessageFormate = errorMessage?.data?.message || errorMessage?.error;
	const sizeClass = `p-inputtext-${size}`;
	const getFormErrorMessage = (name) => {
		return errorMessage[name] ? <small className="p-error">{errorMessage[name].message}</small> : <small className="p-error">&nbsp;</small>;
	};

	return (
		<Controller
			defaultValue={defaultValue} // rules={{ required: "Name - Surname is required." }}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<>
					<span className={classNames({ "p-float-label": label }, { "p-input-icon-left": iconStart }, { "p-input-icon-right": iconEnd })}>
						{iconStart && <i className={classNames("pi", iconStart)} />}
						<InputText id={field.name} value={field.value} type={type} className={classNames({ "p-invalid": fieldState.error }, { [sizeClass]: size })} disabled={disabled} onChange={(e) => field.onChange(e.target.value)} />
						{iconEnd && false && <i className={classNames("pi", iconEnd)} />}
						<label htmlFor={field.name}>{label}</label>
					</span>
					{/* error label */}
					<label htmlFor={field.name} className={classNames({ "p-error": errorMessage || fieldState.error })}>
						{getFormErrorMessage(field.name)}
					</label>
				</>
			)}
		/>
	);
}
