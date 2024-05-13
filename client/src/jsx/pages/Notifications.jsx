import { useSocket } from "@context/SocketContext";
import { useSocketEvent } from "@jsx/hooks/useSocketEvent";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { randomNumberBetween, toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
export function Notifications() {
	const [socket, isConnected, notifications, setNotifications] = useSocket();
	const navigate = useNavigate();


  console.log(notifications);


	const handleDismiss = (index) => {
		setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
	};

	return (
		<div>
			<div className="flex justify-content-between">
				<h2>Notifications</h2>
				<Button label="" />
			</div>
			<div className="border-1 p-2 surface-border border-round-xl">
				{notifications.map((notification, index) => (
					<div
						key={index}
						onKeyDown={() => {}}
						onClick={() => navigate(`/posts/${notification?.data?.likedPost?.id}`)}
						tabIndex={0}
						role="button"
						className="p-2 mb-2 flex align-items-center cursor-pointer hover:bg-primary-900 transition-linear transition-duration-500  border-round-xl"
					>
						<div className="flex align-items-center gap-2 flex-1">
							<Avatar
								size="large"
								icon="pi pi-user"
								className="p-overlay"
								onClick={(event) => {
									event.stopPropagation();
									navigate(`/profile/${notification?.data?.liker?.id}`);
								}}
								image={notification?.data?.liker?.picturePath}
								alt={notification?.data?.liker?.fullName}
								shape="circle"
							/>
							<div className="flex flex-column">
								<div className="flex gap-2 align-items-center">
									<h4>{toTitleCase(notification?.data?.liker?.fullName)}</h4>
									<p className="text-xs text-400 flex gap-2">
										{notification?.type === "like" && `liked your post`}
									</p>
								</div>
								<p className="text-xs text-400 flex gap-2">
									text : ${notification?.data?.likedPost?.description?.slice(0, 20)}...
								</p>
								<div className="flex">
									<div className={`text-xs text-400 flex gap-2`}>
										<div className={`createData-tooltip-${notification?.data?.liker?.id} `}>
											{formatDistanceToNow(new Date(notification?.data?.createdAt), {
												addSuffix: true,
											})}
											<Tooltip
												key={notification?.data?.liker?.id}
												target={`.createData-tooltip-${notification?.data?.liker?.id}`}
												content={format(
													new Date(notification?.data?.createdAt),
													"EEEE, MMMM d, yyyy, h:mm a"
												)}
												position="bottom"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<Button
							className="p-button-text  p-button p-component"
							label="Dismiss"
							size="small"
							onClick={() => handleDismiss(index)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
