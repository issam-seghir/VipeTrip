import { toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";

export function CommentNotification({ notification }) {
	const isReply = !!notification?.comment?.parentComment;
    const parentComment = notification?.comment?.parentComment;
    const description = notification?.comment?.description || parentComment?.description;
	return (
		<div className="flex flex-column">
			<div className="flex gap-2 align-items-baseline">
				<h4 className={classNames({ "text-primary-700": notification?.read })}>
					{toTitleCase(notification?.userFrom?.fullName)}
				</h4>
				<p className="text-xs text-400 flex gap-2">
					{isReply ? "add a reply to your comment" : "commented on your post"}{" "}
				</p>
			</div>
			<p className="text-xs text-400 flex gap-2">text : {description?.slice(0, 20)}...</p>
			<div className="flex">
				<div className={`text-xs text-400 flex gap-2`}>
					<div className={`createData-tooltip-${notification?.userFrom?.id} `}>
						{formatDistanceToNow(new Date(notification?.createdAt), {
							addSuffix: true,
						})}
						<Tooltip
							key={notification?.userFrom?.id}
							target={`.createData-tooltip-${notification?.userFrom?.id}`}
							content={format(new Date(notification?.createdAt), "EEEE, MMMM d, yyyy, h:mm a")}
							position="bottom"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
