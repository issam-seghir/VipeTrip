
import { FileUploadDialog } from "@components/FileUploadDialog";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { PhotosPreview } from "@jsx/components/PhotosPreview";
import { useUpdateUserProfileMutation ,useUpdateCurrentUserProfileMutation} from "@jsx/store/api/userApi";
import { selectCurrentUser } from "@store/slices/authSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { convertModelToFormData } from "../utils/index";
import { PFormDropdown } from "./Form/PFormDropdown";
import { PFormMentionTagTextArea } from "./Form/PFormMentionTagTextArea";
import { selectPostDialogForm, setPostDialogForm } from "@store/slices/postSlice";
import { PFormTextField } from "@components/Form/PFormTextField";
import { PFormAutoCompleteContries } from "@jsx/components/Form/PFormAutoCompleteContries";
import { userProfileSchema } from "@validations/userSchema";

export function EditProfileDialog({ showDialog ,setShowDialog}) {
	const navigate = useNavigate();
	const toast = useRef(null);
	// const showDialog = useSelector(selectPostDialogForm);
	const dispatch = useDispatch();
	const descriptionRef = useRef(null);
	const { profileId } = useParams();
	const { id: currentUserId } = useSelector(selectCurrentUser);
	const isCurrentUser = currentUserId === profileId;
	const [updateUserProfile, updateUserProfileResult] = useUpdateUserProfileMutation();
	const [updateCurrentUserProfile, updateCurrentUserProfileResult] = useUpdateCurrentUserProfileMutation();
	const updateProfileResult = isCurrentUser ? updateCurrentUserProfileResult : updateUserProfileResult;
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
		resolver: zodResolver(userProfileSchema),
	});

	// useEffect(() => {
	// 	if (user) {
	// 		const { images, ...postToEditWithoutImages } = user;
	// 		reset(postToEditWithoutImages);
	// 		setExistingImages(images);
	// 	} else {
	// 		reset({
	// 			description: "",
	// 			privacy: "public",
	// 			mentions: [],
	// 			tags: [],
	// 			images: [],
	// 		});
	// 		setExistingImages([]);
	// 	}
	// }, [postToEdit, reset]);
	const errorMessage = updateProfileResult?.isError ? updateProfileResult?.error : errorsForm;

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

	async function handleUpdateUserProfile(data) {
		try {
			const newData = { ...data, existingImages: existingImages };
			console.log(newData);

			// Convert data to FormData
			const formData = convertModelToFormData(newData);
			// Log FormData
			for (let pair of formData.entries()) {
				console.log(pair[0] + ", " + pair[1]);
			}

			let res = null;
			res = await (isCurrentUser ? updateCurrentUserProfile(formData).unwrap() : updateUserProfile({ id: profileId, data: formData }).unwrap());

			if (res) {
				reset();

				setShowDialog({ open: false, data: showDialog.data });
				toast.current.show({
					severity: "success",
					summary: "Profile Updated 🎉",
					position: "top-center",
					detail: "Your Profile has been Updated successfully",
				});
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				position: "top-center",
				summary: "Error",
				detail: error?.data?.message || "Failed to Updated your Profile",
			});
		}
	}

	const onSubmit = (data) => {
		handleUpdateUserProfile(data);
	};

	const images = watch("images");

	// create new post dialog Actions Handlers
	const handleMediaOpen = () => {
		setShowFileUploadDialog(true);
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

	return (
		<>
			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />
			{/* Create New Post Form Dialog */}
			<Dialog
				key={`${showDialog.data?.id}`}
				header={<h2 className="text-center">{"Update Profile"}</h2>}
				visible={showDialog.open}
				style={{ width: "40%" }}
				contentClassName="py-0"
				breakpoints={{ "960px": "75vw", "640px": "90vw" }}
				onHide={() => {
					setShowDialog({ open: false, data: showDialog.data });
					reset();
					// setExistingImages(postToEdit?.images);
				}}
				draggable={false}
				dismissableMask={!isSubmitting && !updateProfileResult?.isLoading}
				closeOnEscape={!isSubmitting && !updateProfileResult?.isLoading}
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
						</div>
						<Divider />
						<Button
							type="submit"
							label={
								updateProfileResult?.isLoading
									? "Updatting ..."
									: "Update Profile"
							}
							className="w-full"
							iconPos="right"
							loading={isSubmitting  || updateProfileResult?.isLoading}
							onClick={handleSubmit(onSubmit)}
						/>
					</>
				}
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-column gap-2 align-items-center">
						<PFormTextField
							control={control}
							defaultValue={""}
							name={"firstName"}
							label="First Name"
							size={"lg"}
							iconStart={"pi-user"}
							errorMessage={errorMessage}
						/>
						<PFormTextField
							control={control}
							defaultValue={""}
							name={"lastName"}
							label="Last Name"
							size={"lg"}
							iconStart={"pi-user"}
							errorMessage={errorMessage}
						/>
						<PFormTextField
							control={control}
							defaultValue={""}
							name={"job"}
							label="Job"
							size={"lg"}
							iconStart={"pi-briefcase"}
							errorMessage={errorMessage}
						/>
						<PFormAutoCompleteContries
							control={control}
							getValues={getValues}
							defaultValue={""}
							name={"location"}
							iconStart={"pi-map-marker"}
							label="Location"
							size={"lg"}
							errorMessage={errorMessage}
						/>
					</div>

					{/* Photos Preview */}
					{/* error label */}
					{getFormErrorMessage("images")}
					{(images?.length > 0 || existingImages?.length > 0) && (
						<PhotosPreview
							photos={images}
							existingImages={existingImages}
							onPhotoRemove={onPhotoRemove}
							disabled={isSubmitting || updateProfileResult?.isLoading}
						/>
					)}
				</form>
			</Dialog>
		</>
	);
}
