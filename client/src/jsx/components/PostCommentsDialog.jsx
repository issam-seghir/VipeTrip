import { Post } from "@components/Post";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Comments } from "@jsx/components/Comments";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { useCreateCommentMutation } from "@jsx/store/api/commentApi";
import { postApi } from "@jsx/store/api/postApi";
import { selectLimit, selectPage } from "@store/slices/infiniteScrollSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { commentSchema } from "@validations/postSchema";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector ,useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { PFormMentionTagTextArea } from "./Form/PFormMentionTagTextArea";
import { setPostCommentsDialog ,selectPostCommentsDialog } from "@store/slices/postSlice";
import { userApi } from "@jsx/store/api/userApi";
import { selectCurrentUser } from "@store/slices/authSlice";
import { useSocket } from "@context/SocketContext";

export function PostCommentsDialog() {
	const navigate = useNavigate();
	const toast = useRef(null);
	const descriptionCommentRef = useRef(null);
	const [cursorPosition, setCursorPosition] = useState(null);
	const [createComment, createCommentResult] = useCreateCommentMutation();
	const showDialog = useSelector(selectPostCommentsDialog);
	const dispatch = useDispatch();
	const user = useSelector(selectCurrentUser);
	const [socket, isConnected] = useSocket();

	const page = useSelector(selectPage);
	const limit = useSelector(selectLimit);
	const {
		postPrev,
		isFetching: isPrevFetching,
		isLoading: isPrevLoading,
		isSuccess: isPrevSuccess,
		isError: isPrevError,
		error: prevError,
	} = postApi.useGetAllPostsQuery(
		{ page: page - 1, limit },
		{
			selectFromResult: ({ data }) => {
				// console.log("selectFromResult postPrev"); // Log all posts data
				// console.log(data); // Log all posts data
				const selectedPost = data?.data?.find((post) => post?.id === showDialog?.id);
				// console.log(selectedPost); // Log selected post
				return { postPrev: selectedPost };
			},
			skip: !showDialog.id || page === 1, // Skip if showDialog.id is not defined or if we're on the first page
		}
	);
	const {
		postOriginal,
		isFetching: isOriginalFetching,
		isLoading: isOriginalLoading,
		isSuccess: isOriginalSuccess,
		isError: isOriginalError,
		error: originalError,
	} = postApi.useGetAllPostsQuery(
		{ page, limit },
		{
			selectFromResult: ({ data }) => {
				// console.log("selectFromResult postOriginal"); // Log all posts data
				// console.log(data); // Log all posts data
				const selectedPost = data?.data?.find((post) => post?.id === showDialog?.id);
				// console.log(selectedPost); // Log selected post
				return { postOriginal: selectedPost };
			},
			skip: !showDialog.id,
		}
	);
	const {
		postNext,
		isFetching: isNextFetching,
		isLoading: isNextLoading,
		isSuccess: isNextSuccess,
		isError: isNextError,
		error: nextError,
	} = postApi.useGetAllPostsQuery(
		{ page: page + 1, limit },
		{
			selectFromResult: ({ data }) => {
				// console.log("selectFromResult postNext"); // Log all posts data
				// console.log(data); // Log all posts data
				const selectedPost = data?.data?.find((post) => post?.id === showDialog?.id);
				// console.log(selectedPost); // Log selected post
				return { postNext: selectedPost };
			},
			skip: !showDialog.id,
		}
	);
	const {
		bookmarkedPost,
		isFetching: isUserFetching,
		isLoading: isUserLoading,
		isError: isUserError,
		error: userError,
	} = userApi.useGetCurrentUserQuery(undefined, {
		selectFromResult: ({ data }) => {
			// console.log("selectFromResult uszer"); // Log all posts data
			// console.log(data); // Log all posts data
			const selectedPost = data?.bookmarkedPosts.find((post) => post?.id === showDialog?.id);
			// console.log(selectedPost); // Log selected post
			return { bookmarkedPost: selectedPost };
		},
		skip: !showDialog.id,
	});
	const post = postPrev || postOriginal || postNext || bookmarkedPost;

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

	const errorMessage = createCommentResult?.isError ? createCommentResult?.error : errorsForm;

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

	async function handleCreateComment(data) {
		try {
			// Convert data to FormData
			const res = await createComment({ postId: showDialog.id, data }).unwrap();
			if (res) {
				reset({
					description: "",
					mentions: [],
				});
				toast.current.show({
					severity: "success",
					summary: "Comment Created 🎉",
					position: "top-center",
					detail: "Your Comment has been created successfully",
				});
				// handle create new comment notification
				if (isConnected) {
					socket.emit("new comment", res?.data);
				}
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				position: "top-center",
				summary: "Error",
				detail: error?.data?.message || "Failed to create Comment",
			});
		}
	}

	const onSubmit = (data) => {
		handleCreateComment(data);
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

	if (
		isNextLoading ||
		isOriginalLoading ||
		isNextFetching ||
		isOriginalFetching ||
		isPrevLoading ||
		isPrevFetching ||
		isUserLoading ||
		isUserFetching
	) {
		return (
			<div>
				<div className="flex items-center justify-center">
					<div className="m-4">
						<Skeleton shape="rect" width="100%" height="100px" />
						<Skeleton shape="text" width="100%" />
						<Skeleton shape="text" width="100%" />
						<Skeleton shape="text" width="100%" />
					</div>
				</div>
			</div>
		);
	}
	return (
		<>
			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />
			{/* Create New Post Form Dialog */}
			<Dialog
				key={`${showDialog?.id}`}
				header={<h2 className="text-center">{`${user?.firstName}'s Post`}</h2>}
				visible={showDialog.open}
				style={{ width: "40%" }}
				contentClassName="py-0"
				breakpoints={{ "960px": "75vw", "640px": "90vw" }}
				onHide={() =>
					dispatch(setPostCommentsDialog({ open: false, id: showDialog?.id }))
				}
				draggable={false}
				dismissableMask={!isSubmitting && !createCommentResult?.isLoading}
				closeOnEscape={!isSubmitting && !createCommentResult?.isLoading}
				footer={
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="border-1 border-100 border-round surface-ground p-2"
					>
						<PFormMentionTagTextArea
							name="description"
							control={control}
							descriptionRef={descriptionCommentRef}
							setCursorPosition={setCursorPosition}
							className="flex mb-2"
							inputClassName="w-full border-none surface-ground shadow-none"
							placeholder="Write your thought ... @ for mentions"
							autoResize={true}
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={true}
							disabled={isSubmitting || createCommentResult?.isLoading || createCommentResult?.isLoading}
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
								type="submit"
								icon={"pi pi-send"}
								className="p-button-text p-2"
								iconPos="right"
								disabled={!description}
								loading={isSubmitting || createCommentResult?.isLoading}
								onClick={handleSubmit(onSubmit)}
							/>
						</div>
					</form>
				}
			>
				<Post post={post} />
				<Comments postId={post?.id} />
			</Dialog>
		</>
	);
}
