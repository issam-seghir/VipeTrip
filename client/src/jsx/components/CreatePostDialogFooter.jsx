import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";


export function CreatePostDialogFooter({
	handleMediaOpen,
	handleEmojiOpen,
	emojiPicker,
	handleEmojiClick,
}) {
	return (
		<div>
			{/* Creat Post Actions */}
			<div className="flex m-2 gap-2">
				<Button
					label="Media"
					icon="pi pi-image"
					iconPos="left"
					className="p-button-text"
					onClick={handleMediaOpen}
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
			<Button label="Post" className="w-full" />
		</div>
	);
}
