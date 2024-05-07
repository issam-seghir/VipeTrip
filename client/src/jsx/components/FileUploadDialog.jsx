import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";

import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";

import { mbToByte } from "@utils/index.js";
import { ACCEPTED_IMAGE_TYPES, MAX_FILES, MAX_FILE_SIZE } from "@validations/postSchema";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller } from "react-hook-form";

export function FileUploadDialog({
	control,
	images,
	existingImages =[],
	resetField,
	onPhotoRemove,
	showFileUploadDialog,
	setShowFileUploadDialog,
}) {
	const toast = useRef(null);

	const NEW_MAX_FILES = MAX_FILES - existingImages.length;
	const onTemplateRemove = (file, callback) => {
		onPhotoRemove(file);
		callback();
	};

	const onTemplateClear = () => {
		resetField("images");
	};

	const headerTemplate = (options) => {
		const { className, chooseButton, uploadButton, cancelButton } = options;

		return (
			<div
				className={className}
				style={{ backgroundColor: "transparent", display: "flex", alignItems: "center" }}
			>
				{chooseButton}
				{uploadButton}
				{cancelButton}
				<div className="flex align-items-center gap-3 ml-auto">
					<span>
						{images?.length || 0} / {NEW_MAX_FILES}
					</span>
				</div>
			</div>
		);
	};

	const itemTemplate = (file, props) => {
		const image = images?.find((f) => f.name === file.name);
		return (
			image && (
				<div className="flex align-items-center flex-wrap">
					<div className="flex flex-1 gap-4 align-items-center">
						<img
							className="border-round-md"
							alt={image.name}
							role="presentation"
							src={image.objectURL}
							width={100}
						/>

						<Tooltip
							key={props.index}
							target={`.desc-${props.index}`}
							content={image.name}
							position="bottom"
						/>
						<div className={`desc-${props.index} text-left`}>
							<div className="white-space-nowrap overflow-hidden text-overflow-ellipsis w-12rem">
								{image.name}
							</div>
							<div>{new Date().toLocaleDateString()}</div>
						</div>
						<Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
					</div>

					<Button
						type="button"
						icon="pi pi-times"
						className="p-button-outlined p-button-rounded p-button-danger ml-auto"
						onClick={() => onTemplateRemove(image, props.onRemove)}
					/>
				</div>
			)
		);
	};

	const emptyTemplate = () => {
		return (
			<div className="flex align-items-center flex-column">
				<i
					className="pi pi-image mt-3 p-5"
					style={{
						fontSize: "5em",
						borderRadius: "50%",
						backgroundColor: "var(--surface-b)",
						color: "var(--surface-d)",
					}}
				></i>
				<span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }} className="my-5">
					Drag and Drop Image Here
				</span>
			</div>
		);
	};

	const chooseOptions = {
		icon: "pi pi-fw pi-images",
		iconOnly: true,
		className: "custom-choose-btn p-button-rounded p-button-outlined",
	};
	const uploadOptions = {
		className: "hidden",
	};
	const cancelOptions = {
		icon: "pi pi-fw pi-times",
		iconOnly: true,
		className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
	};
	return (
		<Dialog
			header={
				<div className="flex">
					<div className="flex align-items-center justify-content-center gap-2">
						<h5>Upload Photos</h5>
					</div>
				</div>
			}
			visible={showFileUploadDialog}
			style={{ width: "50vw" }}
			onHide={() => setShowFileUploadDialog(false)}
			draggable={false}
		>
			<Toast ref={toast} position="top-center" />

			<Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
			<Tooltip target=".custom-upload-btn" content="Confirm" position="bottom" />
			<Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
			<Controller
				defaultValue={[]}
				name="images"
				control={control}
				render={({ field: { onChange, value } }) => (
					<FileUpload
						customUpload
						multiple
						accept={[...ACCEPTED_IMAGE_TYPES].join(",")}
						maxFileSize={mbToByte(MAX_FILE_SIZE)}
						uploadOptions={uploadOptions}
						chooseOptions={chooseOptions}
						cancelOptions={cancelOptions}
						onSelect={(e) => {
							// Filter out the files that have already been selected
							const newFiles = [...e.files].filter(
								(file) => !value.some((selectedFile) => selectedFile.name === file.name)
							);

							if (value.length + newFiles.length > NEW_MAX_FILES) {
								// Select only the first NEW_MAX_FILES - value.length files
								const filesToSelect = newFiles.slice(0, NEW_MAX_FILES - value.length);
								onChange([...value, ...filesToSelect]);

								toast.current.show({
									severity: "error",
									sticky: true,
									summary: "Validation Error",
									detail: `Maximum number of Photos exceeded. Limit is ${NEW_MAX_FILES}.`,
								});
							} else {
								onChange([...value, ...newFiles]);
							}
						}}
						onError={onTemplateClear}
						onClear={onTemplateClear}
						headerTemplate={headerTemplate}
						itemTemplate={itemTemplate}
						emptyTemplate={emptyTemplate}
					/>
				)}
			/>
		</Dialog>
	);
}
