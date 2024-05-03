import { useGetAllPostsQuery } from "@jsx/store/api/postApi";
import { toTitleCase } from "@jsx/utils";
import { formatDistanceToNow,format } from "date-fns";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
import { Gallery } from "./Gallery";

const items = [
	{
		items: [
			{
				label: "Settings",
				icon: "pi pi-cog",
				command: () => {},
			},
			{
				label: "Logout",
				icon: "pi pi-sign-out",
				command: () => {},
			},
		],
	},
];
export function FeedPostsSection() {
	const navigate = useNavigate();
	const optionsMenu = useRef(null);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

	const serverUrl = import.meta.env.VITE_SERVER_URL;
	const { data: posts, isFetching, isLoading, isError, error } = useGetAllPostsQuery();
	if (isLoading) {
		return (
			<div>
				<h5>Rectangle</h5>
				<Skeleton className="mb-2"></Skeleton>
				<Skeleton width="10rem" className="mb-2"></Skeleton>
				<Skeleton width="5rem" className="mb-2"></Skeleton>
				<Skeleton height="2rem" className="mb-2"></Skeleton>
				<Skeleton width="10rem" height="4rem"></Skeleton>
			</div>
		);
	}

	if (!posts) {
		return <div>Missing post!</div>;
	}

	if (isError) {
		console.log(error);
		<div>
			{error.status} {JSON.stringify(error.data)}
		</div>;
		// toast.error("échec de la requet des user");
	}

	console.log(posts);
	return (
		<div className={classNames("bg-red", isFetching)}>
			{posts.map((post) => (
				<div
					key={post.id}
					id={post.id}
					className="flex flex-column justify-content-between gap-3 p-3 w-full border-1 surface-border border-round"
				>
					{/* Post header  */}
					<div className="flex">
						<div className="flex aligne-items-center gap-2 flex-1">
							<Avatar
								size="large"
								icon="pi pi-user"
								className="p-overlay"
								onClick={() => navigate(`/profile/${post?.author?.id}`)}
								image={post?.author?.picturePath}
								alt={post?.author?.fullName}
								shape="circle"
							/>
							<div className="flex flex-column">
								<div
									onKeyDown={() => {}}
									onClick={() => navigate(`/profile/${post?.author?.id}`)}
									tabIndex={0}
									role="button"
									className="font-bold p-1 cursor-pointer hover:text-primary-500"
								>
									{toTitleCase(post?.author?.fullName)}
								</div>
								<div className={`text-xs text-400 flex gap-2`}>
									<div className={`createData-tooltip-${post.id} `}>
										{formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
										<Tooltip
											key={post.id}
											target={`.createData-tooltip-${post.id}`}
											content={format(new Date(post?.createdAt), "EEEE, MMMM d, yyyy, h:mm a")}
											position="bottom"
										/>
									</div>
									{post?.privacy === "onlyMe" && (
										<>
											<Tooltip
												key={post.id}
												target={`.privacy-tooltip-${post.id}`}
												content={"private"}
												position="bottom"
											/>
											<i className={`pi pi-lock privacy-tooltip-${post.id}`}></i>
										</>
									)}
									{post?.privacy === "friends" && (
										<>
											<Tooltip
												key={post.id}
												target={`.privacy-tooltip-${post.id}`}
												content={"shard with friends only"}
												position="bottom"
											/>
											<i className={`pi pi-users privacy-tooltip-${post.id}`}></i>
										</>
									)}
									{post?.privacy === "public" && (
										<>
											<Tooltip
												key={post.id}
												target={`.privacy-tooltip-${post.id}`}
												content={"public"}
												position="bottom"
											/>
											<i className={`pi pi-globe privacy-tooltip-${post.id}`}></i>
										</>
									)}
									{post?.edited && (
										<>
											<i className={`pi edited-tooltip-${post.id} pi-pencil`}></i>
											<Tooltip
												key={post.id}
												target={`.edited-tooltip-${post.id}`}
												content={`edited : ${formatDistanceToNow(new Date(post?.updatedAt), {
													addSuffix: true,
												})}`}
												position="bottom"
											/>
										</>
									)}
								</div>
							</div>
						</div>
						<Menu
							model={items}
							popup
							popupAlignment="right"
							closeOnEscape
							ref={optionsMenu}
							id="popup_menu_right"
						/>
						<Button
							icon="pi pi-ellipsis-h"
							className="p-button-text w-fit h-fit p-2"
							aria-controls="popup_menu_right"
							aria-haspopup
							onClick={(event) => optionsMenu.current.toggle(event)}
						/>
					</div>
					<div className="flex-inline p-1">
						{isDescriptionExpanded ? post?.description : post?.description.slice(0, 100)}
						{post?.description.length > 100 && (
							<Button
								className="p-button-text w-fit h-fit p-0 ml-1 text-sm vertical-align-baseline  border-none shadow-none"
								onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
							>
								{!isDescriptionExpanded && "... Show More"}
							</Button>
						)}
					</div>
					<Gallery images={post?.images} />
				</div>
			))}
			<div id="scroll-anchor" />
			{/* {isFetchingNextPage && "Loading more..."} */}
		</div>
	);
}
