import { useGetAllCommentsQuery } from "@jsx/store/api/commentApi";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Comment } from "./Comment";

export function Comments() {
	const { data: comments, error, isLoading, isFetching, isError } = useGetAllCommentsQuery();
    const toast = useRef(null);
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

	if (!comments) {
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
			{comments.map((comment) => (
				<Comment
					id={comment?.id}
					key={comment?.id}
					comment={comment}
				/>
			))}
			<div id="scroll-anchor" />
			{/* {isFetchingNextPage && "Loading more..."} */}
		</div>
	);
}
