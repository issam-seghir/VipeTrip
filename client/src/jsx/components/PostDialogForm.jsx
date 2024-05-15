import { FileUploadDialog } from "@components/FileUploadDialog";
import { useSocket } from "@context/SocketContext";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { PhotosPreview } from "@jsx/components/PhotosPreview";
import { useCreatePostMutation, useGetPostQuery, useUpdatePostMutation } from "@jsx/store/api/postApi";
import { selectCurrentUser } from "@store/slices/authSlice";
import { selectPostDialogForm, setPostDialogForm } from "@store/slices/postSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { createPostSchema } from "@validations/postSchema";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertModelToFormData } from "../utils/index";
import { PFormDropdown } from "./Form/PFormDropdown";
import { PFormMentionTagTextArea } from "./Form/PFormMentionTagTextArea";

const privacies = [
	{ label: "onlyMe", value: "onlyMe" },
	{ label: "friends", value: "friends" },
	{ label: "public", value: "public" },
];
export function PostDialogForm() {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const toast = useRef(null);
	const showDialog = useSelector(selectPostDialogForm);
	const dispatch = useDispatch();
	const descriptionRef = useRef(null);
	const [cursorPosition, setCursorPosition] = useState(null);
	const [socket, isConnected] = useSocket();

	const [createPost, createPostResult] = useCreatePostMutation();
	const [updatePost, updatePostResult] = useUpdatePostMutation();
	const {
		data: postToEdit,
		isFetching,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetPostQuery(showDialog?.id, {
		skip: !showDialog.id,
	});
	const isUpdate = Boolean(showDialog?.id);
	const [existingImages, setExistingImages] = useState([]);

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

	useEffect(() => {
		if (isUpdate && postToEdit) {
			const { images, ...postToEditWithoutImages } = postToEdit;
			reset(postToEditWithoutImages);
			setExistingImages(images);
		} else {
			reset({
				description: "",
				privacy: "public",
				mentions: [],
				tags: [],
				images: [],
			});
			setExistingImages([]);
		}
	}, [isUpdate, postToEdit, reset]);
	const errorUpdateMessage = updatePostResult?.isError ? updatePostResult?.error : errorsForm;
	const errorCreateMessage = createPostResult?.isError ? createPostResult?.error : errorsForm;
	const errorMessage = isUpdate ? errorUpdateMessage : errorCreateMessage;

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
				// handle create new comment notification
				if (isConnected) {
					console.log("new post event to server");
					socket.emit("new post", res?.data);
				}
				reset();
				dispatch(setPostDialogForm({ open: false, id: null }));

				// setShowDialog({ open: false, id: null });
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
	async function handleUpdatePost(data) {
		try {
			const newData = { ...data, existingImages: existingImages };
			console.log(newData);

			// Convert data to FormData
			const formData = convertModelToFormData(newData);
			// Log FormData
			for (let pair of formData.entries()) {
				console.log(pair[0] + ", " + pair[1]);
			}

			const res = await updatePost({ id: postToEdit?.id, data: formData }).unwrap();
			if (res) {
				reset();
				dispatch(setPostDialogForm({ open: false, id: postToEdit?.id }));

				// setShowDialog({ open: false, id: postToEdit.id });
				toast.current.show({
					severity: "success",
					summary: "Post Updated 🎉",
					position: "top-center",
					detail: "Your post has been Updated successfully",
				});
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				position: "top-center",
				summary: "Error",
				detail: error?.data?.message || "Failed to Updated post",
			});
		}
	}

	const onSubmit = (data) => {
		if (isUpdate) {
			handleUpdatePost(data);
		} else {
			handleCreatePost(data);
		}
	};

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
			descriptionRef.current.selectionStart = descriptionRef.current.selectionEnd =
				start + emojiObject?.emoji.length;
		}, 0);
	};
	const values = getValues(); // You can get all input values
	console.log(values);
	const handlePollOpen = () => {
		// handle poll click
	};

	const onPhotoRemove = (photo) => {
		if (existingImages.length > 0 && existingImages.includes(photo)) {
			// Remove image from existing images (server image path)
			const updatedExistingImages = existingImages.filter((image) => image !== photo);
			setExistingImages(updatedExistingImages);
		} else {
			// Remove image from images (client image object)
			const updatedPhotos = images.filter((image) => image.name !== photo.name);
			setValue("images", updatedPhotos, { shouldValidate: true });
		}
	};

	const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

	// Creat Post Actions Handlers
	const emojiPicker = useRef(null);

	const handleEmojiOpen = (e) => {
		emojiPicker.current.toggle(e);
	};

	return (
		<>
			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />
			{/* Create New Post Form Dialog */}
			<Dialog
				key={`${postToEdit?.id}`}
				header={<h2 className="text-center">{isUpdate ? "Update Post" : "Create Post"}</h2>}
				visible={showDialog.open}
				style={{ width: "40%" }}
				contentClassName="py-0"
				breakpoints={{ "960px": "75vw", "640px": "90vw" }}
				onHide={() => {
					dispatch(setPostDialogForm({ open: false, id: isUpdate ? postToEdit?.id : null }));

					// setShowDialog({ open: false, id: isUpdate ? postToEdit?.id : null });
					if (isUpdate) {
						reset();
						setExistingImages(postToEdit?.images);
					} // Reset the form state
				}}
				draggable={false}
				dismissableMask={!isSubmitting && !createPostResult?.isLoading && !updatePostResult?.isLoading}
				closeOnEscape={!isSubmitting && !createPostResult?.isLoading && !updatePostResult?.isLoading}
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
								existingImages={existingImages}
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
							label={
								updatePostResult?.isLoading
									? "Updatting ..."
									: createPostResult?.isLoading
									? "Creatting..."
									: "Post"
							}
							className="w-full"
							iconPos="right"
							loading={isSubmitting || createPostResult?.isLoading || updatePostResult?.isLoading}
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
									name="privacy"
									options={privacies}
									className="w-fit h-2rem pl-2 surface-card"
									pt={{
										item: "p-1 pl-4",
										itemLabel: "p-1",
										input: "p-1",
									}}
									disabled={
										isSubmitting || createPostResult?.isLoading || updatePostResult?.isLoading
									}
									highlightOnSelect={false}
									errorMessage={errorMessage}
								/>
							</div>
						</div>
						{/* content input area  */}
						<PFormMentionTagTextArea
							name="description"
							control={control}
							descriptionRef={descriptionRef}
							setCursorPosition={setCursorPosition}
							className="flex mb-2"
							inputClassName="w-full  surface-card border-transparent shadow-none"
							placeholder="Enter @ to mention people, # to mention tag"
							autoResize={true}
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={true}
							disabled={isSubmitting || createPostResult?.isLoading || updatePostResult?.isLoading}
							errorMessage={errorMessage}
						/>

						{/* Photos Preview */}
						{/* error label */}
						{getFormErrorMessage("images")}
						{(images?.length > 0 || existingImages?.length > 0) && (
							<PhotosPreview
								photos={images}
								existingImages={existingImages}
								onPhotoRemove={onPhotoRemove}
								disabled={isSubmitting || createPostResult?.isLoading || updatePostResult?.isLoading}
							/>
						)}
					</div>
				</form>
			</Dialog>
		</>
	);
}
