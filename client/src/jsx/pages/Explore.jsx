import sectionImg1 from "@assets/images/Autumn Biking Companions.png";
import sectionImg2 from "@assets/images/Contemplative Urban Dreamer.png";
import sectionImg5 from "@assets/images/Contemporary Billiards Lounge with Ambient Lighting.png";
import sectionImg4 from "@assets/images/poster.png";
import sectionImg3 from "@assets/images/wallpaper.png";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import Stories from "react-insta-stories";

const users = [
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	{
		name: "User 1",
		profileImage: "https://picsum.photos/100/100",
		stories: [
			{
				url: sectionImg1,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg2,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg3,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg4,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			{
				url: sectionImg5,
				duration: 5000,
				header: {
					heading: "Mohit Karekar",
					subheading: "Posted 30m ago",
					profileImage: "https://picsum.photos/100/100",
				},
			},
			// ... other stories
		],
	},
	// ... other users
];

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
	const userTemplate = (user) => {
		return (
			<Button
				outlined
				onClick={() => {
					setActiveUser(user);
				}}
				className="cover-overlay h-12rem  w-9 border-1 surface-border border-round" // Add some padding and center the content
			>
				<img
					src={user.profileImage}
					alt={user.name}
					className="rounded-full" // Make the image round and add a white border
				/>
				<div className="w-full text-left text-white text-xs z-5 absolute bottom-0 left-0">
					{/* {Add a gradient overlay at the bottom for the text} */}
					{user.name}
				</div>
			</Button>
		);
	};
	return (
		<div>
			<Carousel
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

			{/* <button onClick={() => setActiveUser(null)}>Close</button> */}
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
									/>
								)}
							</div>
						</div>
					)}
				></Sidebar>
			</div>
		</div>
	);
}
