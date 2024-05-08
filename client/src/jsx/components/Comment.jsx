import {
	useDeleteCommentMutation,
	useLikeDislikeCommentMutation,
	useUpdateCommentMutation,
} from "@jsx/store/api/commentApi";
import { toTitleCase } from "@jsx/utils";
import { selectCurrentUser } from "@store/slices/authSlice";
import { format, formatDistanceToNow } from "date-fns";
import numeral from "numeral";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { Tooltip } from "primereact/tooltip";
import { useRef, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useAnimate } from "framer-motion";


export function Comment({ comment }) {
	const navigate = useNavigate();
	const toast = useRef(null);
	const optionsMenu = useRef(null);
	const dispatch = useDispatch();
	const [scope, animate] = useAnimate();

	const user = useSelector(selectCurrentUser);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [likersDialog, setLikersDialog] = useState(false);
	const shareOverlay = useRef(null);
	const [likeDislikeComment, likeDislikeCommentResult] = useLikeDislikeCommentMutation();
	const [deleteComment, deleteCommentResult] = useDeleteCommentMutation();
	const [updateComment, updateCommentResult] = useUpdateCommentMutation();

	const handleUpdateComment = async (data) => {
		try {
			await updateComment({ postId: comment?.post, commentId: comment?.id, data }).unwrap();
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: error?.data?.message || "Failed to delete Comment",
				life: 3000,
			});
		}
	};
	const handleDeleteComment = async () => {
		try {
			await deleteComment({ postId: comment?.post, commentId: comment?.id }).unwrap();
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: error?.data?.message || "Failed to delete Comment",
				life: 3000,
			});
		}
	};
	const items = [
		...(user.id === comment?.author?.id
			? [
					{
						label: "Edit Post",
						className: "border-round-md m-1",
						icon: "pi pi-file-edit",
						command: handleUpdateComment,
					},
			  ]
			: []),
		...(user.id === comment?.author?.id
			? [
					{
						label: "Delete Post",
						className: "border-round-md m-1",
						style: { backgroundColor: "rgb(247 53 53 / 47%)" },
						icon: "pi pi-trash",
						command: () => {
							confirmDialog({
								tagKey: `delete-comment-dialog-${comment.id}`,
								message: "Do you want to delete this comment?",
								header: "Delete Confirmation",
								icon: "pi pi-info-circle",
								defaultFocus: "reject",
								acceptClassName: "p-button-danger",
								accept: handleDeleteComment,
								reject: () => {},
							});
						},
					},
			  ]
			: []),
	];

		const handleLikeButton = () => {
			likeDislikeComment({ postId: comment?.post, commentId: comment?.id });
			if (scope?.current) {
			animate([
				[".likeCommentButton", { scale: 0.8 }, { duration: 0.1, at: "<" }],
				[".likeCommentButton", { scale: 1.2 }, { duration: 0.2 }],
				[".likeCommentButton", { scale: 1 }, { duration: 0.1 }],
			]);
		}
		};

	return (
		<div ref={scope} className="flex gap-2">
			<Toast ref={toast} />

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
					<div className="flex w-full align-items-center gap-2">
						<div
							onKeyDown={() => {}}
							onClick={() => navigate(`/profile/${comment?.author?.id}`)}
							tabIndex={0}
							role="button"
							className="font-bold flex-1 p-1text-sm cursor-pointer hover:text-primary-500"
						>
							{toTitleCase(comment?.author?.fullName)}
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
						<ConfirmDialog
							tagKey={`delete-comment-dialog-${comment?.id}`}
							id={`delete-comment-dialog-${comment?.id}`}
							key={comment?.id}
						/>
						{user.id === comment?.author?.id && (
							<>
								<Menu
									model={items}
									popup
									popupAlignment="right"
									className="surface-card w-fit"
									pt={{
										menuitem: "text-sm",
									}}
									closeOnEscape
									ref={optionsMenu}
									id="popup_menu_right"
								/>
								<Button
									icon="pi pi-ellipsis-h"
									className="p-button-text p-2 "
									style={{ width: "1.5rem", height: "1.5rem" }}
									aria-controls="popup_menu_right"
									aria-haspopup
									onClick={(event) => optionsMenu.current.toggle(event)}
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
				<div className="flex align-items-center gap-3 ">
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

					<div className="flex align-items-center">
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
							onClick={handleLikeButton}
							diabled={deleteComment?.isLoading || updateComment?.isLoading}
							icon={comment?.likedByUser ? "pi pi-thumbs-up-fill " : "pi pi-thumbs-up"}
							className="likeCommentButton p-1 w-2rem relative  p-button-text shadow-none border-none"
						></Button>
						<Button
							diabled={deleteComment?.isLoading || updateComment?.isLoading}
							icon="pi pi-comment"
							className="p-button-text w-2rem p-0 shadow-none border-none"
							onClick={() => {
								// setShowCommentDialog({ open: true, id: post?.id });
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
