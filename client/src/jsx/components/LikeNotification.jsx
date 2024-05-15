import { toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";

export function LikeNotification({ notification, read }) {
	const isPost = notification?.post;
	const isReply = !!notification?.comment?.parentComment;
	const description = notification?.post?.description || notification?.comment?.description;
	return (
		<div className="flex flex-column">
			<div className="flex gap-2 align-items-baseline">
				<h4 className={classNames({ "text-primary-700": read })}>
					{toTitleCase(notification?.userFrom?.fullName)}
				</h4>
				<p className="text-xs text-400 flex gap-2">
					like your {isPost ? "post" : isReply ? "reply" : "comment"}{" "}
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
