import { useGetAllPostsQuery} from "@jsx/store/api/postApi";
import { classNames } from "primereact/utils";
import {Post} from "@components/Post"
import { Skeleton } from "primereact/skeleton";


export function FeedPostsSection() {


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

	console.log(posts);
	return (
		<div className={classNames("bg-red", isFetching)}>
			{posts.map((post) => (
				<Post id={post.id}  key={post?.id} post={post} />
			))}
			<div id="scroll-anchor" />
			{/* {isFetchingNextPage && "Loading more..."} */}
		</div>
	);
}
