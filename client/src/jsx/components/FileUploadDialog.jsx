import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";

import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";

import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

const MAX_FILES = 5; // Set your limit
export function FileUploadDialog({
	showFileUploadDialog,
	setShowFileUploadDialog,
	savedFiles,
	setSavedFiles,
	totalNumber,
	setTotalNumber,
}) {
	const fileUploadRef = useRef(null);

	const toast = useRef(null);
	console.log("savedFiles");
	console.log(savedFiles);

	const onTemplateSelect = (e) => {
		const selectedFiles = e.files;
		console.log("selected Files");
		console.log(selectedFiles);
		if (totalNumber + selectedFiles.length > MAX_FILES) {
			// Show an error message
			toast.current.show({
				severity: "error",
				sticky: true,
				summary: "Validation Error",
				detail: `Maximum number of files exceeded. Limit is ${MAX_FILES}.`,
			});
			// Remove the excess files
			const excessFiles = new Set(selectedFiles.slice(0, totalNumber + selectedFiles.length - MAX_FILES));
			const updatedFiles = selectedFiles.filter((file) => !excessFiles.has(file));
			setSavedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
			setTotalNumber((prevNumber) => prevNumber + updatedFiles.length);
		} else if (totalNumber < MAX_FILES) {
			setSavedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
			setTotalNumber((prevNumber) => prevNumber + selectedFiles.length);
		}
	};

	const onTemplateRemove = (file, callback) => {
		setTotalNumber((totalNumber) => totalNumber - 1);
		setSavedFiles((files) => {
			const updatedFiles = files.filter((f) => f.name !== file.name);
			fileUploadRef.current.setFiles(updatedFiles); // Update the FileUpload component's internal files state
			return updatedFiles;
		});
		// );
		callback();
	};

	const onTemplateClear = () => {
		setTotalNumber(0);
		setSavedFiles([]);
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
						{totalNumber} / {MAX_FILES}
					</span>
				</div>
			</div>
		);
	};

	const itemTemplate = (file, props) => {
		const realFile = savedFiles.find((f) => f.name === file.name);
		return (
			realFile && (
				<div className="flex align-items-center flex-wrap">
					<div className="flex align-items-center" style={{ width: "40%" }}>
						<img
							className="border-round-md"
							alt={realFile.name}
							role="presentation"
							src={realFile.objectURL}
							width={100}
						/>
						<span className="flex flex-column text-left ml-3">
							{realFile.name}
							<small>{new Date().toLocaleDateString()}</small>
						</span>
					</div>
					<Tag value={props.formatSize} severity="warning" className="px-3 py-2" />

					<Button
						type="button"
						icon="pi pi-times"
						className="p-button-outlined p-button-rounded p-button-danger ml-auto"
						onClick={() => onTemplateRemove(realFile, props.onRemove)}
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

			<FileUpload
				ref={fileUploadRef}
				name="demo[]"
				customUpload
				multiple
				accept="image/*"
				uploadOptions={uploadOptions}
				chooseOptions={chooseOptions}
				cancelOptions={cancelOptions}
				maxFileSize={1_000_000}
				onSelect={onTemplateSelect}
				onError={onTemplateClear}
				onClear={onTemplateClear}
				headerTemplate={headerTemplate}
				itemTemplate={itemTemplate}
				emptyTemplate={emptyTemplate}
			/>
		</Dialog>
	);
}
