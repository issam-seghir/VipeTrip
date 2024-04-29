import { OverlayPanel } from "primereact/overlaypanel";
import { Suspense, lazy, useRef, useState ,forwardRef } from "react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

const customEmojis = [
	{
		names: ["Alice", "alice in wonderland"],
		imgUrl: "https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/alice.png",
		id: "alice",
	},
	{
		names: ["Dog"],
		imgUrl: "https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/dog.png",
		id: "dog",
	},
	{
		names: ["Hat"],
		imgUrl: "https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/hat.png",
		id: "hat",
	},
	{
		names: ["Vest"],
		imgUrl: "https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/vest.png",
		id: "vest",
	},
	{
		names: ["Shock", "Surprised", "WOW", "OMG", "Oh My God", "Oh My Gosh", "Oh Gosh", "Oh God", "Oh No", "Oh Wow"],
		imgUrl: "https://cdn3.emoji.gg/emojis/7980-my-eyes.png",
		id: "shock",
	},
	{
		names: ["Ok", "Okay", "Yes", "Good", "Great", "Fine", "Acceptable", "Agree", "Agreed", "Yup", "Yea", "Yeah"],
		imgUrl: "https://cdn3.emoji.gg/emojis/77093-haruhi-like.png",
		id: "ok",
	},
];


export const EmojiPickerOverlay = forwardRef(({ handleEmojiClick }, ref) => {
	return (
		<OverlayPanel
			ref={ref}
			pt={{
				content: "p-0",
			}}
		>
			<Suspense fallback={<div className="text-4xl text-bluegray-700">Loading .....</div>}>
				<EmojiPicker
					theme="auto"
					emojiStyle={"native"}
					lazyLoadEmojis={true}
					customEmojis={customEmojis}
					onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
				/>
			</Suspense>
		</OverlayPanel>
	);
});

EmojiPickerOverlay.displayName = "EmojiPickerOverlay";
