import { FormLabel, Switch } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";


export const FormInputSlider = ({ name, control, setValue, defaultValue, label, sx }) => {
	const [sliderValue, setSliderValue] = React.useState(30);

	useEffect(() => {
		if (sliderValue) setValue(name, sliderValue);
	}, [name, setValue, sliderValue]);

	const handleChange = (event, newValue) => {
		setSliderValue(newValue);
	};

	return (
		<>
			<FormLabel component="legend">{label}</FormLabel>
			<Controller defaultValue={defaultValue}  name="switch" control={control} render={({ field }) => <Switch onChange={(e) => field.onChange(e.target.checked)} checked={field.value} sx={sx}  />} />
		</>
	);
};
