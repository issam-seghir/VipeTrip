import {
	useDeleteCommentMutation,
	useLikeDislikeCommentMutation,
	useUpdateCommentMutation
} from "@jsx/store/api/commentApi";
import { toTitleCase } from "@jsx/utils";
import { selectCurrentUser } from "@store/slices/authSlice";
import { format, formatDistanceToNow } from "date-fns";
import { useAnimate } from "framer-motion";
import numeral from "numeral";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { useDebounce } from "@uidotdev/usehooks";
import { commentSchema } from "@validations/postSchema";
import { useForm } from "react-hook-form";
import { PFormMentionTagTextArea } from "./Form/PFormMentionTagTextArea";

export function Comment({ comment }) {
	const navigate = useNavigate();
	const toast = useRef(null);
	const optionsMenu = useRef(null);
	const dispatch = useDispatch();
	const [scope, animate] = useAnimate();
	const [isEditing, setIsEditing] = useState(false);
	const descriptionCommentRef = useRef(null);
	const [cursorPosition, setCursorPosition] = useState(null);
	const user = useSelector(selectCurrentUser);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [likeDislikeComment, likeDislikeCommentResult] = useLikeDislikeCommentMutation();
	const [deleteComment, deleteCommentResult] = useDeleteCommentMutation();
	const [updateComment, updateCommentResult] = useUpdateCommentMutation();

	const {
		handleSubmit,
		watch,
		reset,
		setValue,
		getValues,
		resetField,
		control,
		formState: { errors: errorsForm, isSubmitting },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(commentSchema),
	});

	const errorMessage = updateCommentResult?.isError ? updateCommentResult?.error : errorsForm;

	useEffect(() => {
		reset(comment);
	}, [reset, comment]);

	const getFormErrorMessage = (name) => {
		if (errorMessage[name]) {
			// Check if the error message is an array
			return Array.isArray(errorMessage[name]) ? (
				errorMessage[name].map(
					(error, index) =>
						error && (
							<small key={index} className="p-error">
								* {error.message}
							</small>
						)
				)
			) : (
				<small className="p-error">* {errorMessage[name].message}</small>
			);
		} else if (errorMessage?.data?.field === name) {
			// server error
			return <small className="p-error">* {errorMessage?.data?.message}</small>;
		}
	};

	const description = watch("description");
	const debouncedDescription = useDebounce(description, 500); // Debounce the email input by 500ms
	// Set mentions and tags from description input
	useEffect(() => {
		const mentions = debouncedDescription?.match(/@\w+/g) || [];
		setValue("mentions", mentions, { shouldValidate: true });
	}, [debouncedDescription, setValue]);

	const handleEmojiClick = (emojiObject) => {
		const start = cursorPosition;
		const text = getValues("description");
		const before = text.slice(0, Math.max(0, start));
		const after = text.slice(start);
		setValue("description", before + emojiObject?.emoji + after, { shouldValidate: true });
		setTimeout(() => {
			descriptionCommentRef.current.selectionStart = descriptionCommentRef.current.selectionEnd =
				start + emojiObject?.emoji.length;
		}, 0);
	};

	// Creat Post Actions Handlers
	const emojiPicker = useRef(null);

	const handleEmojiOpen = (e) => {
		emojiPicker.current.toggle(e);
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

	const handleUpdateComment = async (data) => {
		try {
			const res = await updateComment({ postId: comment?.post, commentId: comment?.id, data }).unwrap();
			if (res) {
				reset({
					description: "",
					mentions: [],
				});
				setIsEditing(false);
				// setShowDialog({ open: false, id: showDialog?.id });
				toast.current.show({
					severity: "success",
					summary: "Comment Updated 🎉",
					position: "top-center",
					detail: "Your Comment has been Updated successfully",
				});
			}
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: error?.data?.message || "Failed to Update Comment",
				life: 3000,
			});
		}
	};

	const onSubmit = (data) => {
		handleUpdateComment(data);
	};

	const items = [
		...(user.id === comment?.author?.id
			? [
					{
						label: "Edit",
						className: "border-round-md m-1",
						icon: "pi pi-file-edit",
						command: () => setIsEditing(true),
					},
			  ]
			: []),
		...(user.id === comment?.author?.id
			? [
					{
						label: "Delete",
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
			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
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
					<div className="flex w-full  align-items-center gap-2">
						<div
							onKeyDown={() => {}}
							onClick={() => navigate(`/profile/${comment?.author?.id}`)}
							tabIndex={0}
							role="button"
							className="font-bold flex gap-2 align-items-center flex-1 p-1text-sm cursor-pointer hover:text-primary-500"
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
									className="surface-card w-6rem "
									pt={{
										menuitem: "text-sm",
										action: "p-2 border-round-md",
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
						{user.id === comment?.author?.id && isEditing ? (
							<form onSubmit={handleSubmit(onSubmit)}>
								<PFormMentionTagTextArea
									name="description"
									control={control}
									descriptionRef={descriptionCommentRef}
									setCursorPosition={setCursorPosition}
									className="flex mb-2"
									inputClassName="w-full border-none surface-ground shadow-none"
									placeholder="Write your thought ... @ for mentions"
									autoResize={true}
									autoFocus={true}
									disabled={isSubmitting || updateComment?.isLoading || updateComment?.isLoading}
									errorMessage={errorMessage}
								/>
								<div className="flex">
									<div className="flex flex-1">
										<Button
											type="button"
											icon={
												<Icon
													icon="uil:smile"
													className="pi p-button-icon-left"
													width="20"
													height="20"
												/>
											}
											iconPos="left"
											className="p-button-text p-2"
											onClick={handleEmojiOpen}
										/>
										<EmojiPickerOverlay ref={emojiPicker} handleEmojiClick={handleEmojiClick} />
									</div>
									<Button
										icon={"pi pi-times"}
										className="p-button-text p-2"
										iconPos="right"
										disabled={isSubmitting || updateComment?.isLoading}
										onClick={() => setIsEditing(false)}
									/>
									<Button
										type="submit"
										icon={"pi pi-send"}
										className="p-button-text p-2"
										iconPos="right"
										disabled={!description}
										loading={isSubmitting || updateComment?.isLoading}
										onClick={handleSubmit(onSubmit)}
									/>
								</div>
							</form>
						) : (
							<>
								{isDescriptionExpanded ? comment?.description : comment?.description.slice(0, 100)}
								{comment?.description.length > 100 && (
									<Button
										className="p-button-text w-fit h-fit p-0 ml-1 text-sm vertical-align-baseline  border-none shadow-none"
										onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
									>
										{!isDescriptionExpanded && "... Show More"}
									</Button>
								)}
							</>
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
							// onClick={handleUpdateComment}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
