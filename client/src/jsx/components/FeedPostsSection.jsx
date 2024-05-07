import { useGetAllPostsQuery } from "@jsx/store/api/postApi";
import { classNames } from "primereact/utils";
import { Post } from "@components/Post";
import { Skeleton } from "primereact/skeleton";
import {
	selectPostDeleteSuccuss,
	setPostIsDeletedSuccuss,
	selectPostRespostedSuccuss,
	setPostIsRepostedSuccuss,
} from "@store/slices/postSlice";
import { useSelector, useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";

export function FeedPostsSection({ setShowDialog, setShowCommentDialog }) {
	// Get the current values of isPostDeletedSuccuss and isPostDeletedFails
	const toast = useRef(null);
	const toastShown = useRef(false); // Add a new ref to track whether the toast has been shown
	const isPostDeletedSuccuss = useSelector(selectPostDeleteSuccuss);
	const isPostRepostedSuccuss = useSelector(selectPostRespostedSuccuss);
	const dispatch = useDispatch();

	// show success message when deleting a post
	useEffect(() => {
		if (isPostDeletedSuccuss && !toastShown.current) {
			toast.current.show({
				severity: "success",
				summary: "Post Deleted 🎉",
				detail: "Your post has been deleted successfully",
				life: 3000,
			});
			toastShown.current = true; // Set toastShown.current to true after showing the toast
			dispatch(setPostIsDeletedSuccuss(false));
		} else if (!isPostDeletedSuccuss) {
			toastShown.current = false; // Reset toastShown.current to false when isPostDeletedSuccuss is false
		}
	}, [isPostDeletedSuccuss, dispatch]);

	// show success message when Reposting a post

	useEffect(() => {
		if (isPostRepostedSuccuss && !toastShown.current) {
			toast.current.show({
				severity: "success",
				summary: "Post Reposted to your feed  🎉",
				detail: "Your post has been reposted successfully",
				life: 3000,
			});
			toastShown.current = true; // Set toastShown.current to true after showing the toast
			dispatch(setPostIsRepostedSuccuss(false));
		} else if (!isPostRepostedSuccuss) {
			toastShown.current = false; // Reset toastShown.current to false when isPostRepostedSuccuss is false
		}
	}, [isPostRepostedSuccuss, dispatch]);

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

	return (
		<div className={classNames("bg-red", isFetching)}>
			<Toast ref={toast} />
			{posts.map((post) => (
				<Post
					id={post?.id}
					key={post?.id}
					post={post}
					setShowDialog={setShowDialog}
					setShowCommentDialog={setShowCommentDialog}
				/>
			))}
			<div id="scroll-anchor" />
			{/* {isFetchingNextPage && "Loading more..."} */}
		</div>
	);
}
