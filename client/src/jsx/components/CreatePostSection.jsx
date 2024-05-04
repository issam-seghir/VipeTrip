import { FileUploadDialog } from "@components/FileUploadDialog";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { PhotosPreview } from "@jsx/components/PhotosPreview";
import { useCreatePostMutation } from "@jsx/store/api/postApi";
import { selectCurrentUser } from "@store/slices/authSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { createPostSchema } from "@validations/postSchema";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertModelToFormData } from "./../utils/index";
import { PFormDropdown } from "./Form/PFormDropdown";
import { PFormMentionTagTextArea } from "./Form/PFormMentionTagTextArea";

const privacies = ["onlyMe", "friends", "public"];

export function CreatePostSection() {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const toast = useRef(null);
const descriptionRef = useRef(null);
const [cursorPosition, setCursorPosition] = useState(null);
	const [createPost, createPostResult] = useCreatePostMutation();
	const {
		handleSubmit,
		watch,
		reset,
		setValue,
		getValues,
		resetField,
		control,
		formState: { errors: errorsForm, isSubmitting },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(createPostSchema),
	});

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
			// Convert data to FormData
			const formData = convertModelToFormData(data);
			const res = await createPost(formData).unwrap();
			if (res) {
				reset();
				setShowCreatePostDialog(false);
				toast.current.show({
					severity: "success",
					summary: "Post Created 🎉",
					position: "top-center",
					detail: "Your post has been created successfully",
				});
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				position: "top-center",
				summary: "Error",
				detail: error?.data?.message || "Failed to create post",
			});
		}
	}

	const onSubmit = (data) => {
		handleCreatePost(data);
	};

	const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);

	const description = watch("description");
	const debouncedDescription = useDebounce(description, 500); // Debounce the email input by 500ms

	const images = watch("images");

	// Set mentions and tags from description input
	useEffect(() => {
		const mentions = debouncedDescription?.match(/@\w+/g) || [];
		const tags = debouncedDescription?.match(/#\w+/g) || [];
		setValue("mentions", mentions, { shouldValidate: true });
		setValue("tags", tags, { shouldValidate: true });
	}, [debouncedDescription, setValue]);

	// create new post dialog Actions Handlers
	const handleMediaOpen = () => {
		setShowFileUploadDialog(true);
	};
	// const handleEmojiClick = (emojiObject) => {
	// 	const prevValue = getValues("description");
	// 	setValue("description", `${prevValue} ${emojiObject?.emoji}`, { shouldValidate: true });
	// };
const handleEmojiClick = (emojiObject) => {
	const start = cursorPosition;
	const text = getValues("description");
	const before = text.slice(0, Math.max(0, start));
	const after = text.slice(start);
	setValue("description", before + emojiObject?.emoji + after, { shouldValidate: true });
	setTimeout(() => {
		descriptionRef.current.selectionStart = descriptionRef.current.selectionEnd = start + emojiObject?.emoji.length;
	}, 0);
};

	const handlePollOpen = () => {
		// handle poll click
	};

	const onPhotoRemove = (photo) => {
		const updatedPhotos = images.filter((image) => image.name !== photo.name);
		setValue("images", updatedPhotos, { shouldValidate: true });
	};

	const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

	// Creat Post Actions Handlers
	const emojiPicker = useRef(null);

	const handleEmojiOpen = (e) => {
		emojiPicker.current.toggle(e);
	};

	const CreatePostWidget = ({ onClick }) => (
		<div
			className="cursor-pointer flex flex-column justify-content-between gap-3 p-3 w-full border-1 surface-border border-round"
			onClick={onClick}
			onKeyDown={() => {}}
			tabIndex={0}
			role="button"
		>
			<div className="flex justify-content-between gap-2">
				<Avatar
					size="large"
					onClick={() => navigate(`/profile/${user?.id}`)}
					image={user?.picturePath}
					alt={user?.fullName}
					shape="circle"
				/>
				<div className="pl-6 p-2 flex-1 text-left border-1 surface-border border-round-3xl">
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
	);

	return (
		<>
			{/* Create New post Widget */}
			<CreatePostWidget onClick={() => setShowCreatePostDialog(true)} />

			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />
			{/* Create New Post Form Dialog */}
			<Dialog
				header={<h2 className="text-center">Create Post</h2>}
				visible={showCreatePostDialog}
				style={{ width: "40%" }}
				contentClassName="py-0"
				breakpoints={{ "960px": "75vw", "640px": "90vw" }}
				onHide={() => setShowCreatePostDialog(false)}
				draggable={false}
				dismissableMask={!isSubmitting && !createPostResult?.isLoading}
				closeOnEscape={true}
				footer={
					<>
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
								images={images}
								resetField={resetField}
								onPhotoRemove={onPhotoRemove}
								showFileUploadDialog={showFileUploadDialog}
								setShowFileUploadDialog={setShowFileUploadDialog}
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
					</>
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
								<PFormDropdown
									control={control}
									defaultValue="public"
									name="privacy"
									options={privacies}
									className="w-fit h-2rem pl-2 surface-card"
									pt={{
										item: "p-1 pl-4",
										itemLabel: "p-1",
										input: "p-1",
									}}
									disabled={isSubmitting || createPostResult?.isLoading}
									highlightOnSelect={false}
									errorMessage={errorMessage}
								/>
							</div>
						</div>
						{/* content input area  */}
						<PFormMentionTagTextArea
							defaultValue=""
							name="description"
							control={control}
							descriptionRef={descriptionRef}
							setCursorPosition={setCursorPosition}
							className="flex mb-2"
							inputClassName="w-full  surface-card border-transparent shadow-none"
							placeholder="Enter @ to mention people, # to mention tag"
							autoResize={true}
							autoFocus={true}
							disabled={isSubmitting || createPostResult?.isLoading}
							errorMessage={errorMessage}
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
