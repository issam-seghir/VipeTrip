import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

export const PFormDropdown = ({
	control,
	defaultValue,
	name,
	options,
	pt,
	className,
	errorMessage,
	highlightOnSelect,
	disabled,
}) => {
	const getErrorMessage = (name) => {
		if (errorMessage[name]) {
			// Check if the error message is an array
			return Array.isArray(errorMessage[name]) ? (
				errorMessage[name].map(
					(error, index) =>
						error && (
							<small key={index} className="p-error">
								* {error.message}
							</small>
						)
				)
			) : (
				<small className="p-error">* {errorMessage[name].message}</small>
			);
		} else if (errorMessage?.data?.field === name) {
			// server error
			return <small className="p-error">* {errorMessage?.data?.message}</small>;
		}
	};
	return (
		<Controller
			// defaultValue={defaultValue}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<>
					<Dropdown
						id={field.name}
						value={field.value}
						focusInputRef={field.ref}
						{...field}
						className={classNames({ "p-invalid": fieldState.error }, className)}
						options={options}
						onChange={(e) => field.onChange(e.value)}
						highlightOnSelect={highlightOnSelect}
						disabled={disabled}
						pt={pt}
					/>

					{/* error label */}
					<label
						htmlFor={field.name}
						style={{ textWrap: "balance" }}
						className={classNames({
							"p-error": getErrorMessage(name) || fieldState.error,
						})}
					>
						{getErrorMessage(name)}
					</label>
				</>
			)}
		/>
	);
};
