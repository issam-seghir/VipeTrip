import { FileUploadDialog } from "@components/FileUploadDialog";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useRef, useState } from "react";

export function CreatePostDialogFooter({
	handleEmojiClick,
	savedPhotos,
	setSavedPhotos,
	totalNumber,
	setTotalNumber,
	createPostResult,
	isSubmitting,
	handleSubmit,
}) {
	const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
	const handleMediaOpen = () => {
		setShowFileUploadDialog(!showFileUploadDialog);
	};

	// Creat Post Actions Handlers
	const emojiPicker = useRef(null);

	const handleEmojiOpen = (e) => {
		emojiPicker.current.toggle(e);
	};

	return (
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
					showFileUploadDialog={showFileUploadDialog}
					setShowFileUploadDialog={setShowFileUploadDialog}
					setSavedFiles={setSavedPhotos}
					savedFiles={savedPhotos}
					totalNumber={totalNumber}
					setTotalNumber={setTotalNumber}
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
				onClick={handleSubmit}
			/>
		</div>
	);
}
