import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import { FileUploadDialog } from "@components/FileUploadDialog";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { PhotosPreview } from "@jsx/components/PhotosPreview";
import { useCreatePostMutation } from "@jsx/store/api/postApi";
import { selectCurrentUser } from "@store/slices/authSlice";
import { createPostSchema } from "@validations/postSchema";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Mention } from "primereact/mention";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

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

const privacies = ["onlyMe", "friends", "public"];
const tagSuggestions = ["primereact", "primefaces", "primeng", "primevue"];

export function CreatePostSection() {
	const user = useSelector(selectCurrentUser);
	const toast = useRef(null);

	const [createPost, createPostResult] = useCreatePostMutation();
	const {
		handleSubmit,
		watch,
		reset,
		setError,
		setValue,
		getValues,
		resetField,
		clearErrors,
		control,
		formState: { errors: errorsForm, isSubmitting, isValidating, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(createPostSchema),
	});
	console.log("errorsForm", errorsForm);
	console.log("values", getValues());

	const errorMessage = createPostResult?.isError ? createPostResult?.error : errorsForm;

	const getFormErrorMessage = (name) => {
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

	async function handleCreatePost(data) {
		try {
			console.log(data);
			const res = await createPost(data).unwrap();
			if (res) {
				reset();
				toast.current.show({
					severity: "success",
					summary: "Post Created 🎉",
					detail: "Your post has been created successfully",
				});
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				summary: "Login Failed 💢",
				detail: error?.data?.message || "email or password not correct",
			});
		}
	}

	const onSubmit = (data) => {
		console.log("---------------- Submitting ---------------");
		handleCreatePost(data);
	};

	const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);

	// for mentions/tags overlay suggestion
	const [multipleSuggestions, setMultipleSuggestions] = useState([]);
	const description = watch("description");
	const images = watch("images");

	useEffect(() => {
		const mentions = description?.match(/@\w+/g) || [];
		const tags = description?.match(/#\w+/g) || [];
		setValue("mentions", mentions, { shouldValidate: true });
		setValue("tags", tags, { shouldValidate: true });
	}, [description, setValue]);

	// for fileUploads
	const [savedPhotos, setSavedPhotos] = useState([]);

	const handleEmojiClick = (emojiObject) => {
		const prevValue = getValues("description");
		setValue("description", `${prevValue} ${emojiObject?.emoji}`, { shouldValidate: true });
	};

	const onPhotoRemove = (photo) => {
		console.log("photo", photo);
		    const updatedPhotos = images.filter((image) => image.name !== photo.name);
			console.log("updatedPhotos", updatedPhotos);
			setValue("images", updatedPhotos, { shouldValidate: true });
	};

	const handlePollOpen = () => {
		// handle poll click
	};

	const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
	const handleMediaOpen = () => {
		setShowFileUploadDialog(!showFileUploadDialog);
	};

	// Creat Post Actions Handlers
	const emojiPicker = useRef(null);

	const handleEmojiOpen = (e) => {
		emojiPicker.current.toggle(e);
	};

	const onMultipleSearch = (event) => {
		const trigger = event.trigger;

		if (trigger === "@") {
			//in a real application, make a request to a remote url with the query and return suggestions, for demo we filter at client side
			setTimeout(() => {
				const query = event.query;
				let suggestions;

				suggestions =
					query.trim().length > 0
						? users.filter((user) => {
								return user.name.toLowerCase().startsWith(query.toLowerCase());
						  })
						: [...users];
				console.log("suggestions", suggestions);
				setMultipleSuggestions(suggestions);
			}, 250);
		} else if (trigger === "#") {
			setTimeout(() => {
				const query = event.query;
				let suggestions;

				suggestions =
					query.trim().length > 0
						? tagSuggestions.filter((tag) => {
								return tag.toLowerCase().startsWith(query.toLowerCase());
						  })
						: [...tagSuggestions];

				setMultipleSuggestions(suggestions);
			}, 250);
		}
	};
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

	return (
		<>
			{/* Create New post Widget */}
			<div
				className="cursor-pointer flex flex-column justify-content-between gap-2 p-3 w-full border-1 surface-border border-round"
				onClick={() => setShowCreatePostDialog(true)}
				onKeyDown={() => {}}
				tabIndex={0}
				role="button"
			>
				<div className="flex justify-content-between align-items-center gap-2">
					<Avatar
						size="large"
						// onClick={(event) => menuLeft.current.toggle(event)}
						image={user?.picturePath}
						alt={user?.fullName}
						shape="circle"
					/>
					<div className="pl-6 p-2 w-full border-1 surface-border border-round-3xl">
						What&apos;s on your mind?
					</div>
				</div>
				<div className="flex gap-2">
					<Button label="Media" icon="pi pi-image" iconPos="left" className="p-button-text" />
					<Button
						label="Emoji"
						icon={<Icon icon="uil:smile" className="pi p-button-icon-left" />}
						iconPos="left"
						className="p-button-text"
					/>
					<Button label="Poll" icon="pi pi-chart-bar" iconPos="left" className="p-button-text" />
				</div>
			</div>

			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />
			{/* Create New Post Form Dialog */}
			<Dialog
				header={<h2 className="text-center">Create Post</h2>}
				visible={showCreatePostDialog}
				style={{ width: "50vw" }}
				onHide={() => setShowCreatePostDialog(false)}
				draggable={false}
				dismissableMask={true}
				closeOnEscape={true}
				footer={
					// <form onSubmit={handleSubmit(onSubmit)}>
					<div className="p-dialog-footer">
						{/* Creat Post Actions */}
						<div className="flex m-2 gap-2">
							<Button
								label="Media"
								icon="pi pi-image"
								iconPos="left"
								className="p-button-text"
								onClick={handleMediaOpen}
							/>
							<FileUploadDialog
								control={control}
								getValues={getValues}
								setValue={setValue}
								onPhotoRemove={onPhotoRemove}
								images={images}
								resetField={resetField}
								showFileUploadDialog={showFileUploadDialog}
								setShowFileUploadDialog={setShowFileUploadDialog}
								setSavedFiles={setSavedPhotos}
								savedFiles={savedPhotos}
							/>
							<Button
								label="Emoji"
								icon={<Icon icon="uil:smile" className="pi p-button-icon-left" />}
								iconPos="left"
								className="p-button-text"
								onClick={handleEmojiOpen}
							/>
							<EmojiPickerOverlay ref={emojiPicker} handleEmojiClick={handleEmojiClick} />
							<Button
								label="Poll"
								icon="pi pi-chart-bar"
								iconPos="left"
								className="p-button-text"
								// onClick={handlePollOpen}
							/>
						</div>
						<Divider />
						<Button
							type="submit"
							label={createPostResult?.isLoading ? "Creatting..." : "Post"}
							className="w-full"
							iconPos="right"
							loading={isSubmitting || createPostResult?.isLoading}
							onClick={handleSubmit(onSubmit)}
						/>
					</div>
					// </form>
				}
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-column gap-4">
						{/* user cerdinals  */}
						<div className="flex  justify-content-start gap-3">
							<Avatar
								size="large"
								className="mt-1 h-4rem w-4rem"
								image={user?.picturePath}
								alt={user?.fullName}
								shape="circle"
							/>
							<div className="flex flex-column gap-1">
								<h5 className="text-xl">{user?.fullName} </h5>
								<Controller
									defaultValue={"public"}
									name={"privacy"}
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Dropdown
												id={field.name}
												value={field.value}
												focusInputRef={field.ref}
												{...field}
												className={classNames(
													{ "p-invalid": fieldState.error },
													"w-fit h-2rem pl-2"
												)}
												options={privacies}
												onChange={(e) => field.onChange(e.value)}
												highlightOnSelect={false}
												pt={{
													item: "p-1 pl-4",
													itemLabel: "p-1",
													input: "p-1",
												}}
											/>

											{/* error label */}
											<label
												htmlFor={field.name}
												style={{ textWrap: "balance" }}
												className={classNames({
													"p-error": errorMessage || fieldState.error,
												})}
											>
												{getFormErrorMessage(field.name)}
											</label>
										</>
									)}
								/>
							</div>
						</div>
						{/* content input area  */}
						<Controller
							defaultValue={""}
							name={"description"}
							control={control}
							render={({ field, fieldState }) => (
								<div className="flex flex-column ">
									<Mention
										id={field.name}
										value={field.value}
										{...field}
										className={classNames({ "p-invalid": fieldState.error }, "flex mb-2")}
										inputClassName="w-full h-25rem max-h-29rem overflow-auto"
										onChange={(e) => field.onChange(e.target.value)}
										trigger={["@", "#"]}
										suggestions={multipleSuggestions}
										onSearch={onMultipleSearch}
										field={["name"]}
										placeholder="Enter @ to mention people, # to mention tag"
										itemTemplate={multipleItemTemplate}
										autoResize={true}
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
										{getFormErrorMessage(field.name)}
										{getFormErrorMessage("mentions")}
										{getFormErrorMessage("tags")}
									</label>
								</div>
							)}
						/>

						{/* Photos Preview */}
						{/* error label */}
						{getFormErrorMessage("images")}
						{images?.length > 0 && <PhotosPreview photos={images} onPhotoRemove={onPhotoRemove} />}
					</div>
				</form>
			</Dialog>
		</>
	);
}
