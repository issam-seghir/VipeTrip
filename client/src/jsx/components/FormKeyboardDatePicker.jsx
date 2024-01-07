// import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";

import { FormLabel, Switch } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";

// export const FormInputSlider = ({ name, control, setValue, defaultValue, label, sx }) => {

// 	return (
// 		<>
// 			<FormLabel component="legend">{label}</FormLabel>
// 				<MuiPickersUtilsProvider utils={DateFnsUtils}>
// 					<Controller
// 						name="MUIPicker"
// 						control={control}
// 						render={({ field: { ref, ...rest } }) => (
// 							<KeyboardDatePicker
// 								margin="normal"
// 								id="date-picker-dialog"
// 								label="Date picker dialog"
// 								format="MM/dd/yyyy"
// 								KeyboardButtonProps={{
// 									"aria-label": "change date",
// 								}}
// 								{...rest}
// 							/>
// 						)}
// 					/>
// 				</MuiPickersUtilsProvider>
// 		</>
// 	);
// };
