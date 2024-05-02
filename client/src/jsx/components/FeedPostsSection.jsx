import { useGetAllPostsQuery } from "@jsx/store/api/postApi";
import { Skeleton } from 'primereact/skeleton';
import { classNames } from "primereact/utils";
import { Fragment } from "react";

export function FeedPostsSection() {
	const { data: posts, isFetching, isLoading, isError, error } = useGetAllPostsQuery();
	if (isLoading) {
		return <div>
                    <h5>Rectangle</h5>
                    <Skeleton className="mb-2"></Skeleton>
                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                    <Skeleton height="2rem" className="mb-2"></Skeleton>
                    <Skeleton width="10rem" height="4rem"></Skeleton>
                </div>;
	}

	if (!posts) {
		return <div>Missing post!</div>;
	}

  if (isError) {
		console.log(error);
		<div>
      {error.status} {JSON.stringify(error.data)}
    </div>
		// toast.error("échec de la requet des user");
  }



	return (
		<div className={classNames("bg-red", isFetching)}>
			{posts.map((page, i) => (
				<Fragment key={i}>
					{page.posts.map((post) => (
						<div key={post.id} id={post.id}>
							{post.description}
						</div>
					))}
				</Fragment>
			))}
			<div id="scroll-anchor" />
			{/* {isFetchingNextPage && "Loading more..."} */}
		</div>
	);
}
