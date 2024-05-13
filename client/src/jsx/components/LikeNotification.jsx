import { toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";

export function LikeNotification({ data, read }) {
	const { liker, likedPost, likedComment, createdAt, type } = data;
	const description = likedPost?.description || likedComment?.description;

	return (
		<div className="flex flex-column">
			<div className="flex gap-2 align-items-baseline">
				<h4 className={classNames({ "text-primary-700": read })}>{toTitleCase(liker?.fullName)}</h4>
				<p className="text-xs text-400 flex gap-2">liked your {type?.toLowerCase()} </p>
			</div>
			<p className="text-xs text-400 flex gap-2">text : {description?.slice(0, 20)}...</p>
			<div className="flex">
				<div className={`text-xs text-400 flex gap-2`}>
					<div className={`createData-tooltip-${liker?.id} `}>
						{formatDistanceToNow(new Date(createdAt), {
							addSuffix: true,
						})}
						<Tooltip
							key={liker?.id}
							target={`.createData-tooltip-${liker?.id}`}
							content={format(new Date(createdAt), "EEEE, MMMM d, yyyy, h:mm a")}
							position="bottom"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
