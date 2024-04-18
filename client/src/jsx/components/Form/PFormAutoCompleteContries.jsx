import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { CountryService } from "@store/api/countriesApi";
import { Controller } from "react-hook-form";
import { useMediaQuery } from "@uidotdev/usehooks";

export function PFormAutoCompleteContries({
	control,
	getValues,
	defaultValue = "",
	name,
	label,
	size,
	iconStart,
	errorMessage,
	disabled = false,
}) {
	const [countries, setCountries] = useState([]);
	// const [selectedCountry, setSelectedCountry] = useState(null);
	const [filteredCountries, setFilteredCountries] = useState(null);

	const sizeClass = `p-inputtext-${size}`;
	const isMobile = useMediaQuery("only screen and (max-width : 460px)");
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	const isMediumDevice = useMediaQuery("only screen and (min-width : 769px) and (max-width : 992px)");

	console.log(errorMessage);
	const getFormErrorMessage = (name) => {
		return errorMessage[name] ? (
			<small className="p-error">{errorMessage[name].message}</small>
		) : (
			<small className="p-error">&nbsp;</small>
		);
	};

	const panelFooterTemplate = () => {
		const isCountrySelected = (filteredCountries || []).some(
			(country) => country["name"] === getValues("location")
		);
		return (
			<div className="py-2 px-3">
				{isCountrySelected ? (
					<span>
						<b>{getValues("location")}</b> selected.
					</span>
				) : (
					"No country selected."
				)}
			</div>
		);
	};

	const search = (event) => {
		// Timeout to emulate a network connection
		setTimeout(() => {
			let _filteredCountries;

			if (!event.query.trim().length) {
				_filteredCountries = [...countries];
			} else {
				_filteredCountries = countries.filter((country) => {
					return country.name.toLowerCase().startsWith(event.query.toLowerCase());
				});
			}

			setFilteredCountries(_filteredCountries);
		}, 250);
	};

	const itemTemplate = (item) => {
		return (
			<div className="flex align-items-center">
				<img
					alt={item.name}
					src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
					className={`flag flag-${item.code.toLowerCase()} mr-2`}
					style={{ width: "18px" }}
				/>
				<div>{item.name}</div>
			</div>
		);
	};

	const selectedCountryTemplate = (item) => {
		return (
			<div className="flex align-items-center">
				<img
					alt={item.name}
					src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
					className={`flag flag-${item.code.toLowerCase()} mr-2`}
					style={{ width: "18px" }}
				/>
				<div>{item.name}</div>
			</div>
		);
	};

	useEffect(() => {
		CountryService.getCountries().then((data) => setCountries(data));
	}, []);

	return (
		<Controller
			defaultValue={defaultValue}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div className="flex flex-column align-items-center ">
					<span className={classNames({ "p-float-label": label }, { "p-input-icon-left": iconStart })}>
						{iconStart && <i className={classNames("pi", iconStart)} />}
						<AutoComplete
							inputId={field.name}
							inputRef={field.ref}
							// field={"name"}
							dropdown
							value={field.value}
							suggestions={filteredCountries}
							completeMethod={search}
							className={classNames(
								{ "p-invalid": fieldState.error },
								{ "p-inputtext-sm": isMobile },
								{ "p-inputtext-md": isSmallDevice },
								{ [sizeClass]: !isSmallDevice && size }
							)}
							disabled={disabled}
							onChange={(e) => {
								field.onChange(e.value);
							}}
							selectedItemTemplate={selectedCountryTemplate}
							itemTemplate={itemTemplate}
							panelFooterTemplate={panelFooterTemplate}
						/>
						<label htmlFor={field.name}>{label}</label>
					</span>
					{/* error label */}
					<label
						htmlFor={field.name}
						className={classNames({
							"p-error": errorMessage || fieldState.error,
						})}
					>
						{getFormErrorMessage(field.name)}
					</label>
				</div>
			)}
		/>
	);
}
