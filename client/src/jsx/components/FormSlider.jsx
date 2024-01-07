import { FormLabel, Slider } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";



//? --------------- Usage ---------------

/*

	const { control, setValue } = useForm({
		defaultValues: defaultValues,
	});
	<FormInputSlider
        name={"sliderValue"}
        control={control}
        setValue={setValue}
        label={"Slider Input"}
		/>
*/


export const FormInputSlider = ({ name, control, setValue,defaultValue, label,sx }) => {
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
			<Controller name={name} defaultValue={defaultValue} control={control} render={({ field, fieldState, formState }) => <Slider {...field} value={sliderValue} onChange={handleChange} valueLabelDisplay="auto" min={0} max={100} step={1} sx={sx} />} />
		</>
	);
};
