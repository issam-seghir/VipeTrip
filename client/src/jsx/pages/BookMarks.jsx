import React from 'react'
import { useGetBookmarkedPostsQuery } from '@jsx/store/api/userApi';
import { Toast } from "primereact/toast";
import { Post } from "@components/Post";
import { selectCurrentUser } from "@store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export  function BookMarks() {
	const dispatch = useDispatch();
	const user = useSelector(selectCurrentUser);

  return (
		<div>
			<Toast ref={toast} />
			{user.bookmarkedPosts?.map((post, index, arr) => (
				<Post
					id={post.id}
					key={post.id}
					post={post}
					setShowDialog={setShowDialog}
					setShowCommentDialog={setShowCommentDialog}
				/>
			))}
			{isFetching && (
				<div>
					<h5>Rectangle</h5>
					<Skeleton className="mb-2"></Skeleton>
					<Skeleton width="10rem" className="mb-2"></Skeleton>
					<Skeleton width="5rem" className="mb-2"></Skeleton>
					<Skeleton height="2rem" className="mb-2"></Skeleton>
					<Skeleton width="10rem" height="4rem"></Skeleton>
				</div>
			)}
		</div>
  );
}
