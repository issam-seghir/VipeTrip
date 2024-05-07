import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { EmojiPickerOverlay } from "@jsx/components/EmojiPickerOverlay";
import { useCreateCommentMutation, useGetCommentQuery, useUpdateCommentMutation } from "@jsx/store/api/commentApi";
import { selectCurrentUser } from "@store/slices/authSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { commentSchema } from "@validations/postSchema";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Post } from "@components/Post";
import {  useGetPostQuery } from "@jsx/store/api/postApi";
import { Skeleton } from "primereact/skeleton";

export function PostCommentsDialog({ showDialog, setShowDialog }) {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const toast = useRef(null);
	const descriptionCommentRef = useRef(null);
	const [cursorPosition, setCursorPosition] = useState(null);
	const [createComment, createCommentResult] = useCreateCommentMutation();
	const [updateComment, updateCommentResult] = useUpdateCommentMutation();
	// const {
	// 	data: comment,
	// 	isFetching,
	// 	isLoading,
	// 	isSuccess,
	// 	isError,
	// 	error,
	// } = useGetCommentQuery(showDialog?.id, {
	// 	skip: !showDialog.id,
	// });
    	const {
			data: post,
			isFetching,
			isLoading,
			isSuccess,
			isError,
			error,
		} = useGetPostQuery(showDialog?.id, {
			skip: !showDialog.id,
		});
	const isUpdate = Boolean(showDialog?.id);
	console.log(showDialog);
	console.log(post);


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

	useEffect(() => {
			reset({
				description: "",
				mentions: [],
			});
	}, [post, reset]);
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
			const res = await createComment(data).unwrap();
			if (res) {
				reset();
				setShowDialog({ open: false, id: showDialog?.id });
				toast.current.show({
					severity: "success",
					summary: "Comment Created 🎉",
					position: "top-center",
					detail: "Your Comment has been created successfully",
				});
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
    
if (isLoading || isFetching) {
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
				header={<h2 className="text-center">{`${user.fullName}'s Post`}</h2>}
				visible={showDialog.open}
				style={{ width: "40%" }}
				contentClassName="py-0"
				breakpoints={{ "960px": "75vw", "640px": "90vw" }}
				onHide={() => {
					setShowDialog({ open: false, id: showDialog?.id });
				}}
				draggable={false}
				dismissableMask={!isSubmitting && !createCommentResult?.isLoading}
				closeOnEscape={!isSubmitting && !createCommentResult?.isLoading}
				footer={
					<form onSubmit={handleSubmit(onSubmit)}>
						{/* Creat Comment Form */}
						<div className="flex m-2 gap-2">
							<Button
								label="Emoji"
								icon={<Icon icon="uil:smile" className="pi p-button-icon-left" />}
								iconPos="left"
								className="p-button-text"
								onClick={handleEmojiOpen}
							/>
							<EmojiPickerOverlay ref={emojiPicker} handleEmojiClick={handleEmojiClick} />
						</div>
						<Divider />
						<Button
							type="submit"
							label={createCommentResult?.isLoading ? "Creatting..." : "Post"}
							className="w-full"
							iconPos="right"
							loading={isSubmitting || createCommentResult?.isLoading}
							onClick={handleSubmit(onSubmit)}
						/>
					</form>
				}
			>
				<Post post={post} />
			</Dialog>
		</>
	);
}
