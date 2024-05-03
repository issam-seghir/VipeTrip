import { useGetAllPostsQuery } from "@jsx/store/api/postApi";
import { toTitleCase } from "@jsx/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Galleria } from "primereact/galleria";
import { Image } from "primereact/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
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
								<div className="text-xs text-400 flex gap-2">
									{formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
									{post?.privacy === "onlyMe" && (
										<>
											<Tooltip
												key={post.id}
												target={`.tooltip.pi-lock`}
												content={"private"}
												position="bottom"
											/>
											<i className="pi pi-lock tooltip"></i>
										</>
									)}
									{post?.privacy === "friends" && (
										<>
											<Tooltip
												key={post.id}
												target={`.tooltip.pi-users`}
												content={"shard with friends only"}
												position="bottom"
											/>
											<i className="pi pi-users tooltip"></i>
										</>
									)}
									{post?.privacy === "public" && (
										<>
											<Tooltip
												key={post.id}
												target={`.tooltip.pi-globe`}
												content={"public"}
												position="bottom"
											/>
											<i className="pi pi-globe tooltip"></i>
										</>
									)}
									{post?.edited && (
										<>
											<i className="pi pi-pencil"></i>
											<Tooltip
												key={post.id}
												target={`.pi-pencil`}
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
					<div className="flex p-1">{post?.description}</div>
						<Gallery images={post?.images} />
						{/* {post?.images.map((imgPath, index) => (
							<div key={index} className={`image-${index + 1} `}>
								<LazyLoadImage
									className={`image image-${index + 1} border-round-xl`}
									src={`${serverUrl}/${imgPath}`}
									alt={`Post ${post.id}`}
									wrapperProps={{
										// If you need to, you can tweak the effect transition using the wrapper style.
										style: { transitionDelay: "1s" },
									}}
									effect="blur"
								/>
							</div>
						))} */}
				</div>
			))}
			<div id="scroll-anchor" />
			{/* {isFetchingNextPage && "Loading more..."} */}
		</div>
	);
}
