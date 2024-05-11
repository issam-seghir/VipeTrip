import { Post } from "@components/Post";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	useGetCurrentUserQuery,
	useGetUserQuery,
	useGetUserPostsQuery,
	useGetCurrentUserPostsQuery,
} from "@jsx/store/api/userApi";
import { CreatePostWidget } from "@components/CreatePostWidget";
import { FeedPostsSection } from "@components/FeedPostsSection";

import { toTitleCase } from "@jsx/utils";
import { selectCurrentUser } from "@store/slices/authSlice";
import { format } from "date-fns";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tooltip } from "primereact/tooltip";
import { useParams } from "react-router-dom";

export function UserPosts() {
	const dispatch = useDispatch();
	const toast = useRef(null);
const { profileId } = useParams();
const { id: currentUserId } = useSelector(selectCurrentUser);
	const {
		data: currentUserPosts,
		isFetching: isCurrentUserPostsFetching,
		isLoading: isCurrentUserPostsLoading,
		isError: isCurrentUserPostsError,
		error: currentUserPostsError,
	} = useGetCurrentUserPostsQuery(undefined, { skip: currentUserId !== profileId });

	const {
		data: otherUserPosts,
		isFetching: isOtherUserFetching,
		isLoading: isOtherUserLoading,
		isError: isOtherUserError,
		error: otherUserError,
	} = useGetUserPostsQuery(profileId, { skip: currentUserId === profileId });
	const posts = currentUserPosts || otherUserPosts;
	const isPostsEmpty = posts?.length === 0;
	if (isCurrentUserPostsLoading||isOtherUserLoading || isOtherUserFetching || isCurrentUserPostsFetching) {
		return (
			<div>
				<h5>Posts</h5>
				<Skeleton className="mb-2"></Skeleton>
				<Skeleton width="10rem" className="mb-2"></Skeleton>
				<Skeleton width="5rem" className="mb-2"></Skeleton>
				<Skeleton height="2rem" className="mb-2"></Skeleton>
				<Skeleton width="10rem" height="4rem"></Skeleton>
			</div>
		);
	}

	if (!posts || isPostsEmpty) {
		return <div>No posts to show!</div>;
	}

	if (isCurrentUserPostsError || isOtherUserError) {
		console.log(currentUserPostsError);
		console.log(otherUserError);
		<div>
			{currentUserPostsError?.status} {JSON.stringify(currentUserPostsError?.data)}
			{otherUserError?.status} {JSON.stringify(otherUserError?.data)}
		</div>;
		// toast.error("échec de la requet des user");
	}
	return (
		<div>
			<Toast ref={toast} />
			{posts?.map((post, index, arr) => (
				<Post id={post.id} key={post.id} post={post} />
			))}
		</div>
	);
}
