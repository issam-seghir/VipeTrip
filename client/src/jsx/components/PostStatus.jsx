import { useGetPostLikersQuery } from "@jsx/store/api/postApi";
import numeral from "numeral";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import {  toTitleCase } from "@jsx/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export const PostStatus = ({ post }) => {
	const navigate = useNavigate();

	const [likersDialog, setLikersDialog] = useState(false);
	// const [trigger, { data: likers, isFetching, isLoading, isError, error }] = useLazyGetPostLikersQuery();
	const {
		data: likers,
		isFetching,
		isLoading,
		isError,
		error,
	} = useGetPostLikersQuery(post.id, { skip: !likersDialog });
	console.log(likers);
	// if (isLoading) {
	// 	return (
	// 		<div>
	// 			<h5>Rectangle</h5>
	// 			<Skeleton className="mb-2"></Skeleton>
	// 			<Skeleton width="10rem" className="mb-2"></Skeleton>
	// 			<Skeleton width="5rem" className="mb-2"></Skeleton>
	// 			<Skeleton height="2rem" className="mb-2"></Skeleton>
	// 			<Skeleton width="10rem" height="4rem"></Skeleton>
	// 		</div>
	// 	);
	// }

	// if (!posts) {
	// 	return <div>Missing post!</div>;
	// }

	// if (isError) {
	// 	console.log(error);
	// 	<div>
	// 		{error.status} {JSON.stringify(error.data)}
	// 	</div>;
	// 	// toast.error("échec de la requet des user");
	// }
	return (
		<div className="flex text-sm text-500 gap-2 mx-2 justify-content-end align-items-center">
			<Dialog visible={likersDialog} onHide={() => setLikersDialog(false)}>
				{likers?.map((liker) => (
					<div key={liker.id} className="flex">
						<div className="flex aligne-items-center gap-2 flex-1">
							<Avatar
								size="large"
								icon="pi pi-user"
								className="p-overlay"
								onClick={() => navigate(`/profile/${liker?.id}`)}
								image={liker?.picturePath}
								alt={liker?.fullName}
								shape="circle"
							/>
							<div className="flex flex-column">
								<div
									onKeyDown={() => {}}
									onClick={() => navigate(`/profile/${liker?.id}`)}
									tabIndex={0}
									role="button"
									className="font-bold p-1 cursor-pointer hover:text-primary-500"
								>
									{toTitleCase(liker?.fullName)}
								</div>
							</div>
						</div>
						<Button icon="pi pi-plus" label="add friend" className="p-button-text w-fit h-fit p-2" />
					</div>
				))}
			</Dialog>
			<AvatarGroup
				className="cursor-pointer flex-1"
				onClick={() => {
					setLikersDialog(true);
					// trigger(post.id);
				}}
			>
				{post.firstThreeLikers.map((liker) => (
					<Avatar
						key={liker.id}
						image={liker.picturePath}
						style={{ width: "1.75rem", height: "1.75rem", marginInlineEnd: "0.2rem" }}
						shape="circle"
					/>
				))}
				{post?.totalLikes > -1 && (
					<div className="text-sm " id={`likes-state-tooltip-${post.id}`}>
						{numeral(post?.totalLikes).format("0a")} likes
						<Tooltip
							key={post.id}
							target={`#likes-state-tooltip-${post.id}`}
							content={`${post?.totalLikes}`}
							position="bottom"
						/>
					</div>
				)}
			</AvatarGroup>
			{post?.totalComments > -1 && <div>{numeral(post?.totalComments).format("0a")} comments</div>}
			{post?.totalShares > -1 && <div>{numeral(post?.totalShares).format("0a")} shares</div>}
		</div>
	);
};
