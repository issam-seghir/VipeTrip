import { Post } from "@components/Post";
import { useGetCurrentUserQuery } from "@jsx/store/api/userApi";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useDispatch } from "react-redux";

export function BookMarks() {
	const dispatch = useDispatch();
	const toast = useRef(null);

	const { data: user, isFetching, isLoading, isError, error } = useGetCurrentUserQuery();
	if (isLoading) {
		return (
			<div>
				<h5>bookmared Posts</h5>
				<Skeleton className="mb-2"></Skeleton>
				<Skeleton width="10rem" className="mb-2"></Skeleton>
				<Skeleton width="5rem" className="mb-2"></Skeleton>
				<Skeleton height="2rem" className="mb-2"></Skeleton>
				<Skeleton width="10rem" height="4rem"></Skeleton>
			</div>
		);
	}

if (!user || (user?.bookmarkedPosts && user?.bookmarkedPosts.length === 0)) {
	return <div>No bookmark to show!</div>;
}

	if (isError) {
		console.log(error);
		<div>
			{error.status} {JSON.stringify(error.data)}
		</div>;
		// toast.error("échec de la requet des user");
	}
	return (
		<div>
			<Toast ref={toast} />
			{user?.bookmarkedPosts?.map((post, index, arr) => (
				<Post
					id={post.id}
					key={post.id}
					post={post}
					// setShowDialog={setShowDialog}
					// setShowCommentDialog={setShowCommentDialog}
				/>
			))}
		</div>
	);
}
