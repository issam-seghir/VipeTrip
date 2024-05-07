import { useDeleteCommentMutation, useLikeDislikeCommentMutation } from "@jsx/store/api/commentApi";
import { toTitleCase } from "@jsx/utils";
import { selectCurrentUser } from "@store/slices/authSlice";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Tooltip } from "primereact/tooltip";
import numeral from "numeral";

export function Comment({ comment }) {
	const navigate = useNavigate();
	const toast = useRef(null);
	const optionsMenu = useRef(null);
	const dispatch = useDispatch();

	const user = useSelector(selectCurrentUser);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [likersDialog, setLikersDialog] = useState(false);
	const shareOverlay = useRef(null);
	const [likeDislikeComment, likeDislikeCommentResult] = useLikeDislikeCommentMutation();
	const [deleteComment, deleteCommentResult] = useDeleteCommentMutation();

	return (
		<div className="flex gap-2">
			<Avatar
				size="small"
				icon="pi pi-user"
				className="p-overlay flex-shrink-0"
				onClick={() => navigate(`/profile/${comment?.author?.id}`)}
				image={comment?.author?.picturePath}
				alt={comment?.author?.fullName}
				shape="circle"
			/>
			<div className="flex flex-column gap-1 ">
				<div className="flex flex-column p-2  border-1 border-round border-200  align-items-start">
					<div className="flex align-items-center gap-2">
						<div
							onKeyDown={() => {}}
							onClick={() => navigate(`/profile/${comment?.author?.id}`)}
							tabIndex={0}
							role="button"
							className="font-bold p-1  text-sm cursor-pointer hover:text-primary-500"
						>
							{toTitleCase(comment?.author?.fullName)}
						</div>
						{comment?.edited && (
							<>
								<i className={`pi edited-tooltip-${comment?.id} pi-pencil`}></i>
								<Tooltip
									key={comment?.id}
									target={`.edited-tooltip-${comment?.id}`}
									content={`edited : ${formatDistanceToNow(new Date(comment?.updatedAt), {
										addSuffix: true,
									})}`}
									position="bottom"
								/>
							</>
						)}
					</div>
					<div className="flex-inline p-1">
						{isDescriptionExpanded ? comment?.description : comment?.description.slice(0, 100)}
						{comment?.description.length > 100 && (
							<Button
								className="p-button-text w-fit h-fit p-0 ml-1 text-sm vertical-align-baseline  border-none shadow-none"
								onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
							>
								{!isDescriptionExpanded && "... Show More"}
							</Button>
						)}
					</div>
				</div>
				<div className="flex align-items-center ">
					<div className={` flex-1  text-xs text-400 flex gap-2`}>
						<div className={`createData-tooltip-${comment?.id} `}>
							{formatDistanceToNow(new Date(comment?.createdAt), { addSuffix: true })}
							<Tooltip
								key={comment?.id}
								target={`.createData-tooltip-${comment?.id}`}
								content={format(new Date(comment?.createdAt), "EEEE, MMMM d, yyyy, h:mm a")}
								position="bottom"
							/>
						</div>
					</div>

					<div className="flex">
						{comment?.totalLikes > 0 && (
							<div className="text-sm " id={`likes-state-tooltip-${comment.id}`}>
								{numeral(comment?.totalLikes).format("0a")} likes
								<Tooltip
									key={comment.id}
									target={`#likes-state-tooltip-${comment.id}`}
									content={`${comment?.totalLikes}`}
									position="bottom"
								/>
							</div>
						)}
						<Button
							// onClick={handleLikeButton}
							icon={comment?.likedByUser ? "pi pi-thumbs-up-fill " : "pi pi-thumbs-up"}
							className="p-1 relative  p-button-text shadow-none border-none"
						></Button>
						<Button
							icon="pi pi-comment"
							className="p-button-text p-0 shadow-none border-none"
							onClick={() => {
								// setShowCommentDialog({ open: true, id: post?.id });
							}}
						/>
					</div>
				</div>
			</div>

			{/* <Menu
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
					/> */}
		</div>
	);
}
