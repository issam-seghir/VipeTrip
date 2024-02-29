import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";

export  function  PFormTextField({ name, control, defaultValue, type,icon, errorMessage, reset }) {
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
				<div className="">
					<label htmlFor={field.name} className={classNames({ "p-error": errorMessage || fieldState.error })}></label>
					<span className="p-float-label">
						<span className="p-input-icon-left">
						<i className="pi pi-user" />
						</span>
						<span className="p-input-icon-left">
						<i className="pi pi-spin pi-spinner" />
						</span>
						<InputText id={field.name} value={field.value} type={type} className={classNames({ "p-invalid": fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />

						<label htmlFor={field.name}>Name - Surname</label>
					</span>
					{getFormErrorMessage(field.name)}
				</div>
			)}
		/>
	);
}
