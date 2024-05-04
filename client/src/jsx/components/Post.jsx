import { useGetLikeStateQuery, useLikeDislikePostMutation } from "@jsx/store/api/postApi";
import { toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
import numeral from "numeral";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
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

export function Post({ post }) {
	const navigate = useNavigate();
	const optionsMenu = useRef(null);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
	const serverUrl = import.meta.env.VITE_SERVER_URL;

	// const {
	// 	data: likeState,
	// 	isFetching: likeStateFetching,
	// 	isLoading: likeStateLoading,
	// 	isError: likeStateError,
	// 	error: likeStateErrorData,
	// } = useGetLikeStateQuery(post?.id, { skip: !post?.id });
	const [likeDislikePost, likeDislikePostResult] = useLikeDislikePostMutation();

	return (
		<div className="flex flex-column justify-content-between gap-3 p-3 w-full border-1 surface-border border-round">
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
			{/* Post Body */}
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

			{/* Post Footer (actions) */}
			<div className="flex text-sm text-500 gap-2 mx-2 justify-content-end align-items-center">
				<AvatarGroup>
					<Avatar
						image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
						style={{ width: "1.75rem", height: "1.75rem", marginInlineEnd: "0.2rem" }}
						shape="circle"
					/>
					<Avatar
						image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
						style={{ width: "1.75rem", height: "1.75rem", marginInlineEnd: "0.2rem" }}
						shape="circle"
					/>
					<Avatar
						image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png"
						style={{ width: "1.75rem", height: "1.75rem", marginInlineEnd: "0.2rem" }}
						shape="circle"
					/>
				</AvatarGroup>
				{post?.totalLikes > -1 && <div className="flex-1">{numeral(post?.totalLikes).format("0a")} likes</div>}
				{post?.totalComments > -1 && <div>{numeral(post?.totalComments).format("0a")} comments</div>}
				{post?.totalShares > -1 && <div>{numeral(post?.totalShares).format("0a")} shares</div>}
			</div>

			<div className="flex gap-1">
				<div className="flex-1">
					<Button
						icon="pi pi-thumbs-up"
						className={classNames("p-button-text", { "p-button-success": post?.likedByUser })}
						onClick={() => likeDislikePost(post?.id)}
					/>
					<Button
						icon="pi pi-comment"
						className="p-button-text"
						onClick={() => {
							/* Handle comment action here */
						}}
					/>
					<Button
						icon="pi pi-share-alt"
						className="p-button-text"
						onClick={() => {
							/* Handle share action here */
						}}
					/>
				</div>
				<Button
					icon="pi pi-bookmark"
					className="p-button-text "
					onClick={() => {
						/* Handle bookmark action here */
					}}
				/>
			</div>
		</div>
	);
}
