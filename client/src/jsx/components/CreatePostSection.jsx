import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import { FileUploadDialog } from "@components/FileUploadDialog";
import { Icon } from "@iconify/react";
import { PhotosPreview } from "@jsx/components/PhotosPreview";
import { selectCurrentUser } from "@store/slices/authSlice";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Mention } from "primereact/mention";
import { OverlayPanel } from "primereact/overlaypanel";
import { Suspense, lazy, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CreatePostDialogFooter } from "@jsx/components/CreatePostDialogFooter";


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

	const [selectedPrivacy, setSelectedPrivacy] = useState("public");
	const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);

	// for mentions in description
	const [mentionValue, setMentionValue] = useState("");
	const [multipleSuggestions, setMultipleSuggestions] = useState([]);

	// for fileUploads
	const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
	const [savedPhotos, setSavedPhotos] = useState([]);
	const [totalNumber, setTotalNumber] = useState(0);

	// Creat Post Actions Handlers
	const emojiPicker = useRef(null);

	const handleEmojiOpen = (e) => {
		emojiPicker.current.toggle(e);
	};

	const handleEmojiClick = (emojiObject) => {
		setMentionValue((prevValue) => `${prevValue} ${emojiObject?.emoji}`);
	};
	const handleMediaOpen = () => {
		setShowFileUploadDialog(!showFileUploadDialog);
	};
	const onPhotoRemove = (photo) => {
		const updatedPhotos = savedPhotos.filter((savedPhoto) => savedPhoto.name !== photo.name);
		setSavedPhotos(updatedPhotos);
		setTotalNumber((prevNumber) => prevNumber - 1);
	};

	const handlePollOpen = () => {
		// handle poll click
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
					<CreatePostDialogFooter
						savedPhotos={savedPhotos}
						onPhotoRemove={onPhotoRemove}
						handleMediaOpen={handleMediaOpen}
						handleEmojiOpen={handleEmojiOpen}
						emojiPicker={emojiPicker}
						handleEmojiClick={handleEmojiClick}
					/>
				}
			>
				<div className="flex flex-column gap-4">
					{/* user cerdinals  */}
					<div className="flex align-items-center justify-content-start gap-3">
						<Avatar
							size="large"
							className="h-4rem w-4rem"
							image={user?.picturePath}
							alt={user?.fullName}
							shape="circle"
						/>
						<div className="flex flex-column gap-1">
							<h5 className="text-xl">{user?.fullName} </h5>
							<Dropdown
								pt={{
									item: "p-1 pl-4",
									itemLabel: "p-1",
									input: "p-1",
								}}
								value={selectedPrivacy}
								onChange={(e) => setSelectedPrivacy(e.value)}
								options={privacies}
								className="h-2rem pl-2"
								highlightOnSelect={false}
							/>
						</div>
					</div>
					{/* content input area  */}
					<Mention
						value={mentionValue}
						onChange={(e) => {
							setMentionValue(e.target.value);
						}}
						trigger={["@", "#"]}
						suggestions={multipleSuggestions}
						onSearch={onMultipleSearch}
						field={["name"]}
						placeholder="Enter @ to mention people, # to mention tag"
						itemTemplate={multipleItemTemplate}
						autoResize={true}
						maxLength={3000}
						className="flex mb-2"
						inputClassName="w-full h-25rem max-h-29rem overflow-auto"
					/>
					{/* Photos Preview */}
					{savedPhotos.length > 0 && <PhotosPreview photos={savedPhotos} onPhotoRemove={onPhotoRemove} />}
				</div>
			</Dialog>
			<FileUploadDialog
				showFileUploadDialog={showFileUploadDialog}
				setShowFileUploadDialog={setShowFileUploadDialog}
				setSavedFiles={setSavedPhotos}
				savedFiles={savedPhotos}
				totalNumber={totalNumber}
				setTotalNumber={setTotalNumber}
			/>
		</>
	);
}
