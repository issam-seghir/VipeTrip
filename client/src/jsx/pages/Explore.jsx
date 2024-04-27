import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import { selectCurrentUser } from "@store/slices/authSlice";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import Stories from "react-insta-stories";
import { useSelector } from "react-redux";

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

const responsiveOptions = [
	{
		breakpoint: "1400px",
		numVisible: 2,
		numScroll: 1,
	},
	{
		breakpoint: "1199px",
		numVisible: 3,
		numScroll: 1,
	},
	{
		breakpoint: "767px",
		numVisible: 2,
		numScroll: 1,
	},
	{
		breakpoint: "575px",
		numVisible: 1,
		numScroll: 1,
	},
];
export function Explore() {
	const [activeUser, setActiveUser] = useState(null);
	const user = useSelector(selectCurrentUser);
	const [visible, setVisible] = useState(false);
	console.log("user", user);
	const userTemplate = (user) => {
		return (
			<Button
				outlined
				onClick={() => {
					setActiveUser(user);
				}}
				className="cover-overlay h-12rem  w-11 border-1 surface-border border-round" // Add some padding and center the content
			>
				{/* overlay image */}
				<img
					src={user.stories[0].url}
					alt={user.name}
					className="rounded-full" // Make the image round and add a white border
				/>
				<div className="z-5 absolute top-0 left-0 border-2 border-circle border-500	 p-1 m-1 flex ">
					<Avatar
						classNames=""
						aria-controls="popup_menu_left"
						aria-haspopup
						// onClick={(event) => menuLeft.current.toggle(event)}
						image={user.profileImage}
						alt={user.name}
						shape="circle"
					/>
				</div>
				<div className="w-full p-4 text-left text-white text-xs z-5 absolute bottom-0 left-0">{user.name}</div>
			</Button>
		);
	};
	const nextUser = () => {
		const currentIndex = users.indexOf(activeUser);
		const nextIndex = (currentIndex + 1) % users.length;
		console.log("nextIndex", nextIndex);
		console.log("next user", users?.[nextIndex]);
		setActiveUser(users?.[nextIndex]);
	};
	return (
		<div>
			<Carousel
				className="mb-4"
				value={users}
				numVisible={3}
				numScroll={3}
				showIndicators={false}
				pt={{
					item: "flex justify-content-center",
				}}
				containerClassName="flex justify-content-center"
				contentClassName="flex justify-content-center"
				responsiveOptions={responsiveOptions}
				itemTemplate={userTemplate}
			/>

			<div className="card flex justify-content-center">
				<Sidebar
					visible={activeUser}
					onHide={() => setActiveUser(null)}
					fullScreen
					content={({ closeIconRef, hide }) => (
						<div className="min-h-screen flex relative lg:static surface-card">
							<div className="absolute top-0 right-0 p-4" style={{ zIndex: "1101" }}>
								<Button
									type="button"
									ref={closeIconRef}
									onClick={(e) => hide(e)}
									icon="pi pi-times"
									rounded
									outlined
									className="h-2rem w-2rem"
								></Button>
							</div>
							<div className="w-full h-full overflow-y-auto">
								{activeUser && (
									<Stories
										key={activeUser.id}
										stories={activeUser.stories}
										defaultInterval={1500}
										keyboardNavigation
										preloadCount={3}
										loader={<div>Loading...</div>}
										width={"100%"}
										height={"100%"}
										storyInnerContainerStyles={{
											background: "var(--surface-card)",
											display: "block",
										}}
										onAllStoriesEnd={nextUser}
									/>
								)}
							</div>
						</div>
					)}
				></Sidebar>
			</div>

			<Dialog
				header={
					<div className="flex justify-content-between">
						<h5>Create Post</h5>
						<Avatar size="large" image={user?.picturePath} alt={user?.fullName} shape="circle" />
						<span>{user?.fullName} </span>
					</div>
				}
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => setVisible(false)}
				draggable={false}
				dismissableMask={true}
				closeOnEscape={true}
				footer={
					<div className="flex justify-content-between">
					<Button label="Media" icon="pi pi-image" iconPos="left" className="p-button-text" />
					<Button label="Emoji" icon="pi pi-face-smile" iconPos="left" className="p-button-text" />
					<Button label="Poll" icon="pi pi-chart-bar" iconPos="left" className="p-button-text" />
				</div>
				}
			>
				<p className="m-0">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
					et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</Dialog>
			{/* create new post widget */}
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
				<div className="flex justify-content-between">
					<Button label="Media" icon="pi pi-image" iconPos="left" className="p-button-text" />
					<Button label="Emoji" icon="pi pi-face-smile" iconPos="left" className="p-button-text" />
					<Button label="Poll" icon="pi pi-chart-bar" iconPos="left" className="p-button-text" />
				</div>
			</div>
		</div>
	);
}
