import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function FormTextField({ name, label, control, defaultValue, type, errorMessage,sx }) {
	return (
		<Controller
			defaultValue={defaultValue}
			name={name}
			control={control}
			render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label={label} type={type} error={!!error || !!errorMessage} helperText={error?.message || errorMessage?.data} sx={sx} />}
		/>
	);
}
