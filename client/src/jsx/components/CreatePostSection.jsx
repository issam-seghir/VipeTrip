import { Icon } from "@iconify/react";
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
import { FileUploadDialog } from "@components/FileUploadDialog";
import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg3 from "@assets/images/wallpaper.png";


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



export function CreatePostSection() {
	const user = useSelector(selectCurrentUser);
	const [visible, setVisible] = useState(false);
	const [selectedCity, setSelectedCity] = useState("public");
	const privacies = ["onlyMe", "friends", "public"];
	const [mentionValue, setMentionValue] = useState("");
	const [multipleSuggestions, setMultipleSuggestions] = useState([]);
	const tagSuggestions = ["primereact", "primefaces", "primeng", "primevue"];
	const op = useRef(null);
	const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
	const [savedFiles, setSavedFiles] = useState([]);
	const [totalNumber, setTotalNumber] = useState(0);

	const handleEmojiClick = (emojiObject) => {
		console.log("emojiObject", emojiObject);
		setMentionValue((prevValue) => `${prevValue} ${emojiObject.emoji}`);
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

	const onPhotoRemove = (file, index) => {
		const updatedFiles = savedFiles.filter((f) => f.name !== file.name);
		setSavedFiles(updatedFiles);
		setTotalNumber((prevNumber) => prevNumber - 1);
	};
	return (
		<>
			{/* Create New post Widget */}
			<div
				className="cursor-pointer flex flex-column justify-content-between gap-2 p-3 w-full border-1 surface-border border-round"
				onClick={() => setVisible(true)}
				onKeyDown={() => {}}
				tabIndex={0}
				role="button"
			>
				<div className="flex justify-content-between align-items-center gap-2">
					<Avatar
						size="large"
						aria-controls="popup_menu_left"
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

			{/* Create Post Form Dialog */}
			<Dialog
				header={
					<div className="flex">
						<div className="flex align-items-center justify-content-center gap-2">
							{/* <h5>Create Post</h5> */}
							<Avatar
								size="large"
								className="h-4rem w-4rem"
								image={user?.picturePath}
								alt={user?.fullName}
								shape="circle"
							/>
							<div className="flex flex-column gap-1">
								<h5>{user?.fullName} </h5>
								<Dropdown
									pt={{
										item: "p-1 pl-4",
										itemLabel: "p-1",
										input: "p-1",
									}}
									value={selectedCity}
									onChange={(e) => setSelectedCity(e.value)}
									options={privacies}
									className="h-2rem pl-2"
									highlightOnSelect={false}
								/>
							</div>
						</div>
					</div>
				}
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => setVisible(false)}
				draggable={false}
				dismissableMask={true}
				closeOnEscape={true}
				footer={
					<div>
						{savedFiles.length > 0 && (
							<div className="flex gap-2 mb-2">
								{savedFiles.map((file, index) => (
									<div key={index} className="relative cover w-8rem h-8rem">
										<img src={file.objectURL} alt={file.name} className=" border-round-md" />
										<Button
											type="button"
											size="small"
											icon="pi pi-times"
											className="absolute top-0 left-0 p-1 m-1 z-5 border-circle p-button-danger"
											onClick={() => onPhotoRemove(file, index)}
										/>
									</div>
								))}
							</div>
						)}
						<div className="flex mb-4 gap-2">
							<Button
								label="Media"
								icon="pi pi-image"
								iconPos="left"
								className="p-button-text"
								onClick={() => setShowFileUploadDialog(!showFileUploadDialog)}
							/>
							<Button
								label="Emoji"
								icon={<Icon icon="uil:smile" className="pi p-button-icon-left" />}
								iconPos="left"
								className="p-button-text"
								onClick={(e) => op.current.toggle(e)}
							/>
							<OverlayPanel
								ref={op}
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
										onEmojiClick={handleEmojiClick}
									/>
								</Suspense>
							</OverlayPanel>
							<Button label="Poll" icon="pi pi-chart-bar" iconPos="left" className="p-button-text" />
						</div>
						<Divider />
						<Button label="Post" className="w-full" />
					</div>
				}
			>
				<Mention
					value={mentionValue}
					onChange={(e) => {
						console.log("e.target.value", e.target.value);
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
					className="flex"
					inputClassName="w-full h-25rem max-h-29rem overflow-auto"
				/>
			</Dialog>
			<FileUploadDialog
				showFileUploadDialog={showFileUploadDialog}
				setShowFileUploadDialog={setShowFileUploadDialog}
				setSavedFiles={setSavedFiles}
				savedFiles={savedFiles}
				totalNumber={totalNumber}
				setTotalNumber={setTotalNumber}
			/>
		</>
	);
}
