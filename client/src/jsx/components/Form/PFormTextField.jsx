import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

export function PFormTextField({ control,defaultValue = "", name, label, type = "text", size, icon, errorMessage, reset }) {
	const errorMessageFormate = errorMessage?.data?.message || errorMessage?.error;
	const getFormErrorMessage = (name) => {
		return errorMessage[name] ? <small className="p-error">{errorMessage[name].message}</small> : <small className="p-error">&nbsp;</small>;
	};

	return (
		<Controller
			defaultValue={defaultValue} // rules={{ required: "Name - Surname is required." }}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<span className="p-float-label">
					<InputText id={field.name} value={field.value} type={type} className={classNames({ "p-invalid": fieldState.error }, size)} onChange={(e) => field.onChange(e.target.value)} />
					<label htmlFor={field.name}>{label}</label>
				</span>
			)}
		/>
	);
}
