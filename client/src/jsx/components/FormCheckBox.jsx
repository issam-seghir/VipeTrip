import { Checkbox, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";


//? --------------- Usage ---------------

/*

	const { control, setValue } = useForm({
		defaultValues: defaultValues,
	});
<FormInputMultiCheckbox
        control={control}
        setValue={setValue}
        name={"checkboxValue"}
        label={"Checkbox Input"}
	/>
*/


const options = [
	{
		label: "Checkbox Option 1",
		value: "1",
	},
	{
		label: "Checkbox Option 2",
		value: "2",
	},
];

export const FormInputMultiCheckbox = ({ name, control, setValue, label, defaultValue, sx }) => {
	const [selectedItems, setSelectedItems] = useState([]);
	// we are handling the selection manually here
	const handleSelect = (value) => {
		const isPresent = selectedItems.indexOf(value);
		if (isPresent === -1) {
			setSelectedItems((prevItems) => [...prevItems, value]);
		} else {
			const remaining = selectedItems.filter((item) => item !== value);
			setSelectedItems(remaining);
		}
	};

	// we are setting form value manually here
	useEffect(() => {
		setValue(name, selectedItems);
	}, [name, selectedItems, setValue]);

	return (
		<FormControl size={"small"} variant={"outlined"}>
			<FormLabel component="legend">{label}</FormLabel>

			<div>
				{options.map((option) => {
					return (
						<FormControlLabel
							control={
								<Controller
									defaultValue={defaultValue}
									name={name}
									control={control}
									render={({ field }) => {
										return <Checkbox checked={selectedItems.includes(option.value)} onChange={() => handleSelect(option.value)} sx={sx} />;
									}}
								/>
							}
							label={option.label}
							key={option.value}
						/>
					);
				})}
			</div>
		</FormControl>
	);
};
