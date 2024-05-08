import { Icon } from "@iconify/react";
import {
	useBookmarkPostMutation,
	useDeletePostMutation,
	useLikeDislikePostMutation,
	useRepostPostMutation,
} from "@jsx/store/api/postApi";
import { randomNumberBetween, toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
import { useAnimate } from "framer-motion";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Tooltip } from "primereact/tooltip";
import { useRef, useState, forwardRef } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
import {
	EmailShareButton,
	FacebookMessengerShareButton,
	FacebookShareButton,
	InstapaperShareButton,
	LinkedinShareButton,
	PocketShareButton,
	RedditShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";
import { useCopyToClipboard } from "usehooks-ts";
import { Gallery } from "./Gallery";
import { PostStatus } from "./PostStatus";

import { setPostIsDeletedSuccuss, setPostIsRepostedSuccuss } from "@jsx/store/slices/postSlice";
import { selectCurrentUser } from "@store/slices/authSlice";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";

export const  Post = forwardRef(({ post, setShowDialog, setShowCommentDialog },ref) =>  {
	const navigate = useNavigate();
	const toast = useRef(null);
	const optionsMenu = useRef(null);
	const [copiedText, copy] = useCopyToClipboard(null);
	const dispatch = useDispatch();

	const user = useSelector(selectCurrentUser);
	const [scope, animate] = useAnimate();
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [likersDialog, setLikersDialog] = useState(false);
	const shareOverlay = useRef(null);
	const clientUrl = import.meta.env.VITE_CLIENT_URL;
	const facebookAPIID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
	const shareUrl = `${clientUrl}/posts/${post?.id}`; // Construct the URL of the post
	const [likeDislikePost, likeDislikePostResult] = useLikeDislikePostMutation();
	const [bookmarkPost, bookmarkPostResult] = useBookmarkPostMutation();
	const [deletePost, deletePostResult] = useDeletePostMutation();
	const [repostPost, repostPostResult] = useRepostPostMutation();
	const title = post?.description.split(" ").slice(0, 5).join(" ");

	const items = [
		...(user.id === post?.author?.id
			? [
					{
						label: "Edit Post",
						className: "border-round-md m-1",
						icon: "pi pi-file-edit",
						command: () => {
							setShowDialog({ open: true, id: post.id });
						},
					},
			  ]
			: []),
		{
			label: "Repost to your feed",
			icon: "pi pi-arrow-right-arrow-left",
			className: "border-round-md m-1",
			command: handleRepostPost,
		},
		{
			label: "Copy Post link",
			icon: "pi pi-link",
			className: "border-round-md m-1",
			command: async () => {
				await copy(shareUrl);
				try {
					toast.current.show({
						severity: "success",
						summary: "Success",
						detail: "Post Link copied to clipboard",
						life: 3000,
					});
				} catch {
					toast.current.show({
						severity: "error",
						summary: "Error",
						detail: "Failed to copy Post link",
						life: 3000,
					});
				}
			},
		},
		{
			label: "Unfollow",
			className: "border-round-md m-1",
			icon: "pi pi-user-minus",
			command: () => {},
		},
		{
			label: "Report Post",
			className: "border-round-md m-1",
			icon: "pi pi-exclamation-triangle",
			command: () => {},
		},
		{
			label: "Block User",
			className: "border-round-md m-1",
			icon: "pi pi-ban",
			command: () => {},
		},
		...(user.id === post?.author?.id
			? [
					{
						label: "Delete Post",
						className: "border-round-md m-1",
						style: { backgroundColor: "rgb(247 53 53 / 47%)" },
						icon: "pi pi-trash",
						command: () => {
							confirmDialog({
								tagKey: `delete-post-dialog-${post.id}`,
								message: "Do you want to delete this post?",
								header: "Delete Confirmation",
								icon: "pi pi-info-circle",
								defaultFocus: "reject",
								acceptClassName: "p-button-danger",
								accept: handleDeletePost,
								reject: () => {},
							});
						},
					},
			  ]
			: []),
	];

	const handleDeletePost = async () => {
		try {
			await deletePost(post?.id).unwrap();
			dispatch(setPostIsDeletedSuccuss(true));
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: error?.data?.message || "Failed to delete post",
				life: 3000,
			});
		}
	};

	async function handleRepostPost() {
		try {
			await repostPost(post?.id).unwrap();
			dispatch(setPostIsRepostedSuccuss(true));
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: error?.data?.message || "Failed to repost post",
				life: 3000,
			});
		}
	}

	const handleBookmarkButton = () => {
		bookmarkPost(post?.id);
		if (scope?.current) {
			animate([
				[".bookmardButton", { scale: 0.8 }, { duration: 0.1, at: "<" }],
				[".bookmardButton", { scale: 1.2 }, { duration: 0.2 }],
				[".bookmardButton", { scale: 1 }, { duration: 0.1 }],
			]);
		}
	};
	const handleShareButton = (e) => {
		shareOverlay.current.toggle(e);
	};
	const handleLikeButton = () => {
		likeDislikePost(post?.id);
		const sparkles = Array.from({ length: 20 });
		const sparklesAnimation = sparkles.map((_, index) => [
			`.sparkle-${index}`,
			{
				x: randomNumberBetween(-100, 100),
				y: randomNumberBetween(-100, 100),
				scale: randomNumberBetween(1.5, 2.5),
				opacity: 0,
			},
			{
				duration: 0.4,
				at: "<",
			},
		]);
		const sparklesFadeOut = sparkles.map((_, index) => [
			`.sparkle-${index}`,
			{
				opacity: 1,
				scale: 1,
			},
			{
				duration: 0.3,
				at: "<",
			},
		]);

		const sparklesReset = sparkles.map((_, index) => [
			`.sparkle-${index}`,
			{
				x: 0,
				y: 0,
				opacity: 0,
			},
			{
				duration: 0.000_001,
			},
		]);
		if (scope?.current) {
			animate([
				...sparklesReset,
				[".likeButton", { scale: 0.8 }, { duration: 0.1, at: "<" }],
				[".likeButton", { scale: 1 }, { duration: 0.1 }],
				...sparklesAnimation,
				...sparklesFadeOut,
			]);
		}
	};

	return (
		<>
			<div
				ref={ref}
				className={classNames(
					"flex flex-column justify-content-between gap-3 p-3 mb-5 w-full border-1 surface-border border-round",
					{ "pointer-events-none ": deletePostResult.isLoading },
					{ "opacity-50 ": deletePostResult.isLoading }
				)}
			>
				{/* Check if the post is a repost and display banner */}
				{post?.sharedFrom && (
					<>
						<div className="banner">
							<i className="pi pi-arrow-right-arrow-left pr-3"></i>
							Reposted from
							<span
								onKeyDown={() => {}}
								onClick={() => navigate(`/profile/${post?.author?.id}`)}
								tabIndex={0}
								role="button"
								className="font-bold p-1 cursor-pointer text-primary-500"
							>
								{toTitleCase(post?.sharedFrom?.author?.fullName)}
							</span>
						</div>
						<Divider className="m-0" />
					</>
				)}
				<Toast ref={toast} />
				<ConfirmDialog
					tagKey={`delete-post-dialog-${post?.id}`}
					id={`delete-post-dialog-${post?.id}`}
					key={post?.id}
				/>
				{/* Post header  */}
				<div className="flex">
					<div className="flex aligne-items-center  gap-2 flex-1">
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
								<div className={`createData-tooltip-${post?.id} `}>
									{formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
									<Tooltip
										key={post?.id}
										target={`.createData-tooltip-${post?.id}`}
										content={format(new Date(post?.createdAt), "EEEE, MMMM d, yyyy, h:mm a")}
										position="bottom"
									/>
								</div>
								{post?.privacy === "onlyMe" && (
									<>
										<Tooltip
											key={post?.id}
											target={`.privacy-tooltip-${post?.id}`}
											content={"private"}
											position="bottom"
										/>
										<i className={`pi pi-lock privacy-tooltip-${post?.id}`}></i>
									</>
								)}
								{post?.privacy === "friends" && (
									<>
										<Tooltip
											key={post?.id}
											target={`.privacy-tooltip-${post?.id}`}
											content={"shard with friends only"}
											position="bottom"
										/>
										<i className={`pi pi-users privacy-tooltip-${post?.id}`}></i>
									</>
								)}
								{post?.privacy === "public" && (
									<>
										<Tooltip
											key={post?.id}
											target={`.privacy-tooltip-${post?.id}`}
											content={"public"}
											position="bottom"
										/>
										<i className={`pi pi-globe privacy-tooltip-${post?.id}`}></i>
									</>
								)}
								{post?.edited && (
									<>
										<i className={`pi edited-tooltip-${post?.id} pi-pencil`}></i>
										<Tooltip
											key={post?.id}
											target={`.edited-tooltip-${post?.id}`}
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
						className="surface-card"
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
				<PostStatus post={post} />
				<Divider className="m-0" />
				{/* Post Footer */}

				<div ref={scope} className="flex gap-1">
					<div className="flex flex-1">
						<Button
							onClick={handleLikeButton}
							icon={post?.likedByUser ? "pi pi-thumbs-up-fill " : "pi pi-thumbs-up"}
							className="likeButton relative  p-button-text shadow-none border-none"
						>
							<span
								aria-hidden
								className="pointer-events-none absolute  bottom-0 left-0 right-0 top-0 block"
								style={{ zIndex: 10 }}
							>
								{Array.from({ length: 20 }).map((_, index) => (
									<svg
										className={`absolute left-50 top-100  sparkle-${index}`}
										key={index}
										viewBox="0 0 122 117"
										width="10"
										height="10"
									>
										<path
											style={{ fill: "var(--primary-500)" }}
											d="M64.39,2,80.11,38.76,120,42.33a3.2,3.2,0,0,1,1.83,5.59h0L91.64,74.25l8.92,39a3.2,3.2,0,0,1-4.87,3.4L61.44,96.19,27.09,116.73a3.2,3.2,0,0,1-4.76-3.46h0l8.92-39L1.09,47.92A3.2,3.2,0,0,1,3,42.32l39.74-3.56L58.49,2a3.2,3.2,0,0,1,5.9,0Z"
										/>
									</svg>
								))}
							</span>
						</Button>
						<Button
							icon="pi pi-comment"
							className="p-button-text shadow-none border-none"
							onClick={() => {
								setShowCommentDialog({ open: true, id: post?.id });
							}}
						/>
						<Button
							icon="pi pi-share-alt"
							className="p-button-text shadow-none border-none"
							onClick={handleShareButton}
						/>
						<OverlayPanel
							ref={shareOverlay}
							pt={{
								content: "p-0",
							}}
						>
							<div className="flex flex-wrap w-13rem justify-content-center p-1">
								{/* ...other components... */}
								<div>
									<Button
										tooltip="Repost : Share in your feed "
										tooltipOptions={{ position: "top" }}
										icon="pi pi-arrow-right-arrow-left"
										className="p-button-text"
										onClick={handleRepostPost}
									/>
									<FacebookShareButton url={shareUrl} title={title} hashtag={post?.tags[0]}>
										<Button icon="pi pi-facebook" className="p-button-text" />
									</FacebookShareButton>
									<FacebookMessengerShareButton url={shareUrl} appId={facebookAPIID}>
										<Button
											icon={<Icon icon="fe:messanger" width="20" height="20" />}
											iconPos="left"
											className="p-button-text"
										/>
									</FacebookMessengerShareButton>
									<TwitterShareButton url={shareUrl} title={title} hashtags={post?.tags}>
										<Button icon="pi pi-twitter" className="p-button-text" />
									</TwitterShareButton>
								</div>
								<div>
									<LinkedinShareButton
										url={shareUrl}
										title={title}
										summary={post?.description}
										source={clientUrl}
									>
										<Button icon="pi pi-linkedin" className="p-button-text" />
									</LinkedinShareButton>
									<RedditShareButton url={shareUrl} title={title}>
										<Button icon="pi pi-reddit" className="p-button-text" />
									</RedditShareButton>
									<TelegramShareButton url={shareUrl} title={title}>
										<Button icon="pi pi-telegram" className="p-button-text" />
									</TelegramShareButton>
									<WhatsappShareButton url={shareUrl} title={title}>
										<Button icon="pi pi-whatsapp" className="p-button-text" />
									</WhatsappShareButton>
								</div>
								<div>
									<PocketShareButton url={shareUrl} title={title}>
										<Button
											icon={<Icon icon="fe:pocket" width="16" height="16" />}
											className="p-button-text"
										/>
									</PocketShareButton>
									<InstapaperShareButton url={shareUrl} title={title} description={post?.description}>
										<Button
											icon={<Icon icon="cib:instapaper" width="16" height="16" />}
											className="p-button-text"
										/>
									</InstapaperShareButton>
									<EmailShareButton
										subject={post?.title}
										body={`Check out this post: ${post?.title}`}
										url={shareUrl}
									>
										<Button
											tooltip="Share in your email"
											tooltipOptions={{ position: "top" }}
											icon="pi pi-envelope"
											className="p-button-text"
										/>
									</EmailShareButton>
								</div>
							</div>
						</OverlayPanel>
					</div>
					<Button
						icon={post?.bookmarkedByUser ? "pi pi-bookmark-fill " : "pi pi-bookmark"}
						className="bookmardButton relative  p-button-text shadow-none border-none"
						onClick={handleBookmarkButton}
					/>
				</div>
			</div>
		</>
	)
});
Post.displayName = "Post";
