import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import { debounce, fuzzySearch } from "@utils/index";
import { Mention } from "primereact/mention";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Controller } from "react-hook-form";

const users = [
	{
		name: "User 1",
		id: 1,
		profileImage: "https://picsum.photos/100/100",
	},
	{
		name: "User 2",
		id: 2,
		profileImage: "https://picsum.photos/100/100",
	},
	{
		name: "User 3",
		id: 3,
		profileImage: "https://picsum.photos/100/100",
	},
	{
		name: "User 4",
		id: 4,
		profileImage: "https://picsum.photos/100/100",
	},
	{
		name: "User 5",
		id: 5,
		profileImage: "https://picsum.photos/100/100",
	},
	{
		name: "User 6",
		id: 6,
		profileImage: "https://picsum.photos/100/100",
	},
	{
		name: "User 7",
		id: 7,
		profileImage: "https://picsum.photos/100/100",
	},
	// ... other users
];

users.forEach((user) => {
	user.stories = [
		{
			url: sectionImg1,
			duration: 5000,
			header: {
				heading: user.name,
				subheading: "Posted 30m ago",
				profileImage: user.profileImage,
			},
		},
		{
			url: sectionImg2,
			duration: 5000,
			header: {
				heading: user.name,
				subheading: "Posted 30m ago",
				profileImage: user.profileImage,
			},
		},
		{
			url: sectionImg3,
			duration: 5000,
			header: {
				heading: user.name,
				subheading: "Posted 30m ago",
				profileImage: user.profileImage,
			},
		},
		{
			url: sectionImg4,
			duration: 5000,
			header: {
				heading: user.name,
				subheading: "Posted 30m ago",
				profileImage: user.profileImage,
			},
		},
		{
			url: sectionImg5,
			duration: 5000,
			header: {
				heading: user.name,
				subheading: "Posted 30m ago",
				profileImage: user.profileImage,
			},
		},
		// ... other stories ...
	];
});

const tagSuggestions = ["primereact", "primefaces", "primeng", "primevue", "test"];

export const PFormMentionTagTextArea = ({
	control,
	defaultValue = "",
	descriptionRef,
	setCursorPosition,
	name,
	placeholder,
	pt,
	className,
	inputClassName,
	errorMessage,
	autoResize = true,
	autoFocus = true,
	disabled,
}) => {
	const [multipleSuggestions, setMultipleSuggestions] = useState([]);

	const onMultipleSearch = debounce(function (event) {
		// Your search logic here
		const trigger = event.trigger;
		const query = event.query.trim();
		if (query.length > 0) {
			let suggestions;
			if (trigger === "@") {
				suggestions = fuzzySearch(query, users);
			} else if (trigger === "#") {
				suggestions = fuzzySearch(query, tagSuggestions);
			}
			setMultipleSuggestions(suggestions);
		} else {
			setMultipleSuggestions(trigger === "@" ? [...users] : [...tagSuggestions]);
		}
	}, 500);

	const itemTemplate = (suggestion) => {
		return (
			<div className="flex align-items-center">
				<img alt={suggestion.name} src={suggestion.profileImage} />
				<span className="flex flex-column ml-2">
					{suggestion.name}
					<small style={{ fontSize: ".75rem", color: "var(--text-color-secondary)" }}>
						@{suggestion.name}
					</small>
				</span>
			</div>
		);
	};

	const multipleItemTemplate = (suggestion, options) => {
		const trigger = options.trigger;
		if (trigger === "@" && suggestion?.name) {
			return itemTemplate(suggestion);
		} else if (trigger === "#" && !suggestion?.name) {
			return <span>{suggestion}</span>;
		}

		return null;
	};

	const getErrorMessage = (name) => {
		if (errorMessage[name]) {
			// Check if the error message is an array
			return Array.isArray(errorMessage[name]) ? (
				errorMessage[name].map(
					(error, index) =>
						error && (
							<small key={index} className="p-error">
								* {error.message}
							</small>
						)
				)
			) : (
				<small className="p-error">* {errorMessage[name].message}</small>
			);
		} else if (errorMessage?.data?.field === name) {
			// server error
			return <small className="p-error">* {errorMessage?.data?.message}</small>;
		}
	};
	return (
		<Controller
			defaultValue={defaultValue}
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div className="flex flex-column">
					<Mention
						id={field.name}
						value={field.value}
						{...field}
						ref={(e) => {
							field.ref(e);
							descriptionRef.current = e;
						}}
						onBlur={(e) => setCursorPosition(e.target.selectionStart)}
						className={classNames({ "p-invalid": fieldState.error }, className)}
						inputClassName={inputClassName}
						onChange={(e) => field.onChange(e.target.value)}
						trigger={["@", "#"]}
						suggestions={multipleSuggestions}
						onSearch={onMultipleSearch}
						field={["name"]}
						delay={250}
						placeholder={placeholder}
						itemTemplate={multipleItemTemplate}
						autoResize={autoResize}
						autoFocus={autoFocus}
						pt={pt}
						disabled={disabled}
					/>
					{/* error label */}
					<label
						htmlFor={field.name}
						style={{ textWrap: "balance" }}
						className={classNames(
							{
								"p-error": errorMessage || fieldState.error,
							},
							"inline-flex flex-column"
						)}
					>
						{getErrorMessage(field.name)}
						{getErrorMessage("mentions")}
						{getErrorMessage("tags")}
					</label>
				</div>
			)}
		/>
	);
};
