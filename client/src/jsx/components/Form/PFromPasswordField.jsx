/* eslint-disable jsx-a11y/label-has-associated-control */
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

export function PFromPasswordField({ control, defaultValue = "", feedback = true, customeFeedback = false, toggleMask = true, name, label, size, iconStart, iconEnd, errorMessage, reset, disabled = false }) {
	const errorMessageFormate = errorMessage?.data?.message || errorMessage?.error;
	const sizeClass = `p-inputtext-${size}`;
	const getFormErrorMessage = (name) => {
		return errorMessage[name] ? <small className="p-error">{errorMessage[name].message}</small> : <small className="p-error">&nbsp;</small>;
	};
	const header = <div className="font-bold mb-3">Pick a password</div>;
	const footer = (
		<>
			<Divider />
			<p className="mt-2">Suggestions</p>
			<ul className="pl-2 ml-2 mt-0 line-height-3">
				<li>At least one lowercase</li>
				<li>At least one uppercase</li>
				<li>At least one numeric</li>
				<li>Minimum 8 characters</li>
			</ul>
		</>
	);
	return (
		<Controller
			defaultValue={defaultValue} // rules={{ required: "Name - Surname is required." }}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<>
					<span className={classNames({ "p-float-label": label }, { "p-input-icon-left": iconStart }, { "p-input-icon-right": iconEnd })}>
						{iconStart && <i className={classNames("pi", iconStart)} />}
						<Password
							id={field.name}
							value={field.value}
							{...field}
							inputRef={field.ref}
							className={classNames({ "p-invalid": fieldState.error }, { [sizeClass]: size })}
							disabled={disabled}
							onChange={(e) => field.onChange(e.target.value)}
							feedback={feedback}
							toggleMask={toggleMask}
							header={customeFeedback && header}
							footer={customeFeedback && footer}
						/>
						{iconEnd && <i className={classNames("pi", iconEnd)} />}
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
