import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Controller } from "react-hook-form";
import {uuid } from "@utils/randomUUID";

const options = [
	{
		label: "Radio Option 1",
		value: "1",
	},
	{
		label: "Radio Option 2",
		value: "2",
	},
];


export const FormInputRadio = ({ name, label, control, defaultValue, sx }) => {
	const generateRadioOptions = () => {
		return options.map((singleOption) => <FormControlLabel key={uuid()} id={uuid()} value={singleOption.value} label={singleOption.label} control={<Radio />} />);
	};

	console.log(generateRadioOptions());
	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">{label}</FormLabel>
			<Controller
				name={name}
				defaultValue={defaultValue}
				control={control}
				render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
					<RadioGroup value={value} onChange={onChange} sx={sx}>
						{generateRadioOptions()}
					</RadioGroup>
				)}
			/>
		</FormControl>
	);
};
