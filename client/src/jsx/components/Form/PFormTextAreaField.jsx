/* eslint-disable jsx-a11y/label-has-associated-control */
import { useMediaQuery } from "@uidotdev/usehooks";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { InputTextarea } from 'primereact/inputtextarea';

export function PFormTextAreaField({
	control,
	defaultValue = "",
    placeholder,
    label,
	name,
    rows = 6,
    cols = 50,
    fullWidth=false,
    minLength,
    maxLength,
    autoResize =true,
	errorMessage,
	disabled = false,
}) {
	const isMobile = useMediaQuery("only screen and (max-width : 460px)");
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	const isMediumDevice = useMediaQuery("only screen and (min-width : 769px) and (max-width : 992px)");
	const getFormErrorMessage = (name) => {
		if (errorMessage[name]) {
			// react-hook-form error
			return <small className="p-error">{errorMessage[name].message}</small>;
		} else if (errorMessage?.data?.field === name) {
			// server error
			return <small className="p-error">{errorMessage?.data?.message}</small>;
		} else {
			return <small className="p-error">&nbsp;</small>;
		}
	};

	return (
		<Controller
			defaultValue={defaultValue}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div className="flex flex-column align-items-center ">
					<span className={classNames({ "p-float-label": label }, {"w-full":fullWidth})}>
						<InputTextarea
							id={field.name}
							value={field.value}
							placeholder={placeholder}
							className={classNames({ "p-invalid": fieldState.error },{"w-full":fullWidth})}
							autoResize={autoResize}
							rows={rows}
							cols={cols}
							minLength={minLength}
							maxLength={maxLength}
							disabled={disabled}
							onChange={(e) => {
								field.onChange(e.target.value);
							}}
						/>

						<label htmlFor={field.name}>{label}</label>
					</span>
					{/* error label */}
					<label
						htmlFor={field.name}
						style={{ textWrap: "balance" }}
						className={classNames(
							"text-center",
							{
								"p-error": errorMessage || fieldState.error,
							},
							{ "text-xs": isMobile }
						)}
					>
						{getFormErrorMessage(field.name)}
					</label>
				</div>
			)}
		/>
	);
}
