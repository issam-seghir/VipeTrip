import { useSocket } from "@context/SocketContext";
import { useAcceptFriendRequestMutation, useDeleteFriendRequestMutation } from "@jsx/store/api/friendsApi";
import { toTitleCase } from "@jsx/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LikeNotification } from "./../components/LikeNotification";

export function Notifications() {
	const [socket, isConnected, notifications, setNotifications] = useSocket();
	const navigate = useNavigate();

	const toast = useRef(null);

	console.log(notifications);
	function handleNotificationRead(index) {
		setNotifications((prevNotifications) =>
			prevNotifications.map((notif, i) => (i === index ? { ...notif, read: true } : notif))
		);
	}

	const handleDismiss = (index) => {
		setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
	};
	const [deleteFriendRequest, { isLoading: isDeleting }] = useDeleteFriendRequestMutation();
	const [acceptFriendRequest, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();

	const handleDeleteFriendRequest = async (requestId, index) => {
		try {
			const res = await deleteFriendRequest(requestId).unwrap();
			if (res) {
				socket.emit("cancel friend request", res?.data);
				handleDismiss(index);
				toast.current.show({
					severity: "success",
					summary: "Success",
					detail: "the Friend Request is Declined",
				});
			}
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail:
					(error?.data?.message && `${error?.data?.message} Maybe the user cancel the request`) ||
					"Failed to Decline the Request , Maybe the user cancel it",
			});
		}
	};
	const handleAcceptFriendRequest = async (requestId, index) => {
		try {
			const res = await acceptFriendRequest(requestId).unwrap();
			if (res) {
				socket.emit("accept friend request", res?.data);
				handleDismiss(index);
				toast.current.show({
					severity: "success",
					summary: "Success",
					detail: `Congratulaiton you have a new Friend ${res?.data?.fullName} 🥳`,
				});
			}
		} catch (error) {
			console.log(error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail:
					(error?.data?.message && `${error?.data?.message} Maybe the user cancel the request`) ||
					"Failed to Accept friend Request , Maybe the user cancel the request",
			});
		}
	};

	if (notifications.length === 0) {
		return (
			<div>
				<div className="flex justify-content-between mb-5">
					<h2>Notifications</h2>
					<Button
						label="Clear All"
						className="p-button-text  p-button p-component"
						size="small"
						onClick={() => setNotifications([])}
					/>
				</div>
				<div className="flex flex-column align-items-center justify-content-center h-full">
					<svg width="200" height="141" viewBox="0 0 200 141" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M162 0H42C36.4772 0 32 4.47715 32 10V130C32 135.523 36.4772 140 42 140H162C167.523 140 172 135.523 172 130V10C172 4.47715 167.523 0 162 0Z"
							fill="url(#paint0_linear_1_154)"
						/>
						<g filter="url(#filter0_d_1_154)">
							<path
								d="M54 54H189C190.326 54 191.598 54.5268 192.536 55.4645C193.473 56.4021 194 57.6739 194 59V84C194 85.3261 193.473 86.5979 192.536 87.5355C191.598 88.4732 190.326 89 189 89H54C52.6739 89 51.4021 88.4732 50.4645 87.5355C49.5268 86.5979 49 85.3261 49 84V59C49 57.6739 49.5268 56.4021 50.4645 55.4645C51.4021 54.5268 52.6739 54 54 54V54Z"
								fill="white"
							/>
						</g>
						<path
							d="M128 62H102C100.343 62 99 63.3431 99 65C99 66.6569 100.343 68 102 68H128C129.657 68 131 66.6569 131 65C131 63.3431 129.657 62 128 62Z"
							fill="#B4DAFF"
						/>
						<path
							d="M146 75H102C100.343 75 99 76.3431 99 78C99 79.6569 100.343 81 102 81H146C147.657 81 149 79.6569 149 78C149 76.3431 147.657 75 146 75Z"
							fill="#DEE9FC"
						/>
						<path
							d="M79.5 81C84.7467 81 89 76.7467 89 71.5C89 66.2533 84.7467 62 79.5 62C74.2533 62 70 66.2533 70 71.5C70 76.7467 74.2533 81 79.5 81Z"
							fill="#1485FD"
						/>
						<path
							d="M78.703 74H79.487L77.667 69.177H76.862L75.042 74H75.833L76.295 72.796H78.241L78.703 74ZM77.268 70.108L77.989 72.131H76.547L77.268 70.108ZM82.0872 69.863C82.6122 69.863 82.8292 70.304 82.8292 70.71C82.8292 71.123 82.5912 71.55 82.0592 71.55H80.9112V69.863H82.0872ZM80.1622 74H80.9112V72.229H82.1012C83.1372 72.229 83.5712 71.473 83.5712 70.71C83.5712 69.947 83.1372 69.177 82.1012 69.177H80.1622V74Z"
							fill="white"
						/>
						<g filter="url(#filter1_d_1_154)">
							<path
								d="M11 97H146C147.326 97 148.598 97.5268 149.536 98.4645C150.473 99.4021 151 100.674 151 102V127C151 128.326 150.473 129.598 149.536 130.536C148.598 131.473 147.326 132 146 132H11C9.67392 132 8.40215 131.473 7.46447 130.536C6.52678 129.598 6 128.326 6 127V102C6 100.674 6.52678 99.4021 7.46447 98.4645C8.40215 97.5268 9.67392 97 11 97V97Z"
								fill="white"
							/>
						</g>
						<path
							d="M85 105H59C57.3431 105 56 106.343 56 108C56 109.657 57.3431 111 59 111H85C86.6569 111 88 109.657 88 108C88 106.343 86.6569 105 85 105Z"
							fill="#B4DAFF"
						/>
						<path
							d="M103 118H59C57.3431 118 56 119.343 56 121C56 122.657 57.3431 124 59 124H103C104.657 124 106 122.657 106 121C106 119.343 104.657 118 103 118Z"
							fill="#DEE9FC"
						/>
						<path
							d="M23.5 124C28.7467 124 33 119.747 33 114.5C33 109.253 28.7467 105 23.5 105C18.2533 105 14 109.253 14 114.5C14 119.747 18.2533 124 23.5 124Z"
							fill="#1485FD"
						/>
						<path
							d="M19.923 117.631C21.015 117.631 21.428 116.91 21.428 116.056V111.177H20.707V116.056C20.707 116.532 20.49 116.938 19.923 116.938C19.867 116.938 19.552 116.924 19.433 116.882L19.363 117.554C19.545 117.596 19.79 117.631 19.923 117.631ZM24.1431 116.07C25.1161 116.07 25.7741 115.433 25.7741 114.628C25.7741 113.921 25.2631 113.48 24.4511 113.277L23.8421 113.123C23.2331 112.969 23.1841 112.647 23.1841 112.493C23.1841 112.052 23.5901 111.779 24.0451 111.779C24.5421 111.779 24.8991 112.087 24.8991 112.542H25.6131C25.6131 111.667 24.9341 111.121 24.0661 111.121C23.2121 111.121 22.4631 111.66 22.4631 112.507C22.4631 112.906 22.6311 113.515 23.6601 113.774L24.2761 113.928C24.6681 114.033 25.0531 114.236 25.0531 114.663C25.0531 115.062 24.7171 115.412 24.1431 115.412C23.5411 115.412 23.1561 115.013 23.1421 114.6H22.4281C22.4281 115.377 23.1141 116.07 24.1431 116.07Z"
							fill="white"
						/>
						<g filter="url(#filter2_d_1_154)">
							<path
								d="M146 11H11C8.23858 11 6 13.2386 6 16V41C6 43.7614 8.23858 46 11 46H146C148.761 46 151 43.7614 151 41V16C151 13.2386 148.761 11 146 11Z"
								fill="white"
							/>
						</g>
						<path
							d="M83 19H57C55.3431 19 54 20.3431 54 22C54 23.6569 55.3431 25 57 25H83C84.6569 25 86 23.6569 86 22C86 20.3431 84.6569 19 83 19Z"
							fill="#B4DAFF"
						/>
						<path
							d="M101 32H57C55.3431 32 54 33.3431 54 35C54 36.6569 55.3431 38 57 38H101C102.657 38 104 36.6569 104 35C104 33.3431 102.657 32 101 32Z"
							fill="#DEE9FC"
						/>
						<path
							d="M36.5 38C41.7467 38 46 33.7467 46 28.5C46 23.2533 41.7467 19 36.5 19C31.2533 19 27 23.2533 27 28.5C27 33.7467 31.2533 38 36.5 38Z"
							fill="#1485FD"
						/>
						<path
							d="M31.8246 28.6C31.8246 29.384 32.5246 30.07 33.5256 30.07C34.4426 30.07 35.0936 29.531 35.1706 28.775C35.2476 28.075 34.8486 27.536 33.8686 27.277L33.2526 27.116C32.6786 26.969 32.6086 26.675 32.6086 26.486C32.6086 26.094 32.9936 25.821 33.4416 25.821C33.9456 25.821 34.2816 26.101 34.2816 26.549H35.0236C35.0236 25.667 34.3516 25.121 33.4556 25.121C32.6086 25.121 31.8666 25.674 31.8666 26.5C31.8666 26.927 32.0276 27.515 33.0636 27.795L33.6726 27.949C34.1206 28.054 34.4636 28.285 34.4356 28.733C34.3866 29.09 34.0926 29.391 33.5256 29.391C32.9446 29.391 32.5876 28.992 32.5666 28.6H31.8246ZM36.8661 25.87H38.0001C38.9451 25.87 39.4281 26.647 39.4281 27.599C39.4281 28.558 38.9451 29.314 38.0001 29.314H36.8661V25.87ZM38.0001 30C39.3721 30 40.1701 28.971 40.1701 27.599C40.1701 26.227 39.3721 25.177 38.0001 25.177H36.1241V30H38.0001Z"
							fill="white"
						/>
						<defs>
							<filter
								id="filter0_d_1_154"
								x="43"
								y="51"
								width="157"
								height="47"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feColorMatrix
									in="SourceAlpha"
									type="matrix"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
									result="hardAlpha"
								/>
								<feOffset dy="3" />
								<feGaussianBlur stdDeviation="3" />
								<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0" />
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_154" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_dropShadow_1_154"
									result="shape"
								/>
							</filter>
							<filter
								id="filter1_d_1_154"
								x="0"
								y="94"
								width="157"
								height="47"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feColorMatrix
									in="SourceAlpha"
									type="matrix"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
									result="hardAlpha"
								/>
								<feOffset dy="3" />
								<feGaussianBlur stdDeviation="3" />
								<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0" />
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_154" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_dropShadow_1_154"
									result="shape"
								/>
							</filter>
							<filter
								id="filter2_d_1_154"
								x="0"
								y="8"
								width="157"
								height="47"
								filterUnits="userSpaceOnUse"
								colorInterpolationFilters="sRGB"
							>
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feColorMatrix
									in="SourceAlpha"
									type="matrix"
									values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
									result="hardAlpha"
								/>
								<feOffset dy="3" />
								<feGaussianBlur stdDeviation="3" />
								<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0" />
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_154" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_dropShadow_1_154"
									result="shape"
								/>
							</filter>
							<linearGradient
								id="paint0_linear_1_154"
								x1="102"
								y1="0"
								x2="102"
								y2="140"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#E3ECFA" />
								<stop offset="1" stopColor="#DAE7FF" />
							</linearGradient>
						</defs>
					</svg>

					<h2 className="text-2xl text-500">No Notifications</h2>
				</div>
			</div>
		);
	}
	return (
		<div>
			<Toast ref={toast} />
			<div className="flex justify-content-between mb-5">
				<h2>Notifications</h2>
				<Button
					label="Clear All"
					className="p-button-text  p-button p-component"
					size="small"
					onClick={() => setNotifications([])}
				/>
			</div>
			<div className="border-1 p-2 surface-border border-round-xl">
				{notifications.map((notification, index) => (
					<div
						key={index}
						onKeyDown={() => {}}
						onClick={() => {
							navigate(
								`/posts/${
									notification?.data?.likedPost?.id ||
									notification?.data?.likedComment?.post ||
									notification?.data?.post?.id ||
									notification?.data?.parentComment?.post
								}`
							);
							handleNotificationRead(index);
						}}
						tabIndex={0}
						role="button"
						className="p-2 mb-2 flex align-items-center cursor-pointer hover:bg-primary-900 transition-linear transition-duration-500  border-round-xl"
					>
						<div className="flex align-items-center gap-2 flex-1">
							{!notification?.read && <Badge size="normal" severity="info"></Badge>}
							<Avatar
								size="large"
								icon="pi pi-user"
								className="p-overlay"
								onClick={(event) => {
									event.stopPropagation();
									navigate(
										`/profile/${notification?.data?.liker?.id || notification?.data?.userId?.id}`
									);
								}}
								image={
									notification?.data?.liker?.picturePath || notification?.data?.userId?.picturePath
								}
								alt={notification?.data?.liker?.fullName || notification?.data?.userId?.fullName}
								shape="circle"
							/>
							{notification?.type === "like" && (
								<LikeNotification data={notification?.data} read={notification?.read} />
							)}
							{notification?.type === "new-comment" && (
								<div className="flex flex-column">
									<div className="flex gap-2 align-items-baseline">
										<h4 className={classNames({ "text-primary-700": notification?.read })}>
											{toTitleCase(notification?.data?.author?.fullName)}
										</h4>
										<p className="text-xs text-400 flex gap-2">commented on your post </p>
									</div>
									<p className="text-xs text-400 flex gap-2">
										text : {notification?.data?.description?.slice(0, 20)}...
									</p>
									<div className="flex">
										<div className={`text-xs text-400 flex gap-2`}>
											<div className={`createData-tooltip-${notification?.data?.author?.id} `}>
												{formatDistanceToNow(new Date(notification?.data?.createdAt), {
													addSuffix: true,
												})}
												<Tooltip
													key={notification?.data?.author?.id}
													target={`.createData-tooltip-${notification?.data?.author?.id}`}
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
							)}
							{notification?.type === "new-reply" && (
								<div className="flex flex-column">
									<div className="flex gap-2 align-items-baseline">
										<h4 className={classNames({ "text-primary-700": notification?.read })}>
											{toTitleCase(notification?.data?.author?.fullName)}
										</h4>
										<p className="text-xs text-400 flex gap-2">add reply to your comment </p>
									</div>
									<p className="text-xs text-400 flex gap-2">
										text : {notification?.data?.description?.slice(0, 20)}...
									</p>
									<div className="flex">
										<div className={`text-xs text-400 flex gap-2`}>
											<div className={`createData-tooltip-${notification?.data?.author?.id} `}>
												{formatDistanceToNow(new Date(notification?.data?.createdAt), {
													addSuffix: true,
												})}
												<Tooltip
													key={notification?.data?.author?.id}
													target={`.createData-tooltip-${notification?.data?.author?.id}`}
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
							)}
							{notification?.type === "friend-request" && (
								<div className="flex flex-column gap-2">
									<div className="flex gap-2 align-items-baseline">
										<h4 className={classNames({ "text-primary-700": notification?.read })}>
											{toTitleCase(notification?.data?.userId?.fullName)}
										</h4>
										<p className="text-xs text-400 flex gap-2"> has sent you a friend request.</p>
									</div>
									<div className="flex gap-2">
										<Button
											label="Accept"
											className="p-button-rounded px-2 py-0 w-5rem h-2rem text-sm"
											disabled={isAccepting || isDeleting}
											onClick={(event) => {
												event.stopPropagation();
												handleAcceptFriendRequest(notification?.data?.id, index);
											}}
										/>
										<Button
											label="Decline"
											className="p-button-rounded p-button-secondary px-2 py-0 w-5rem h-2rem text-sm"
											disabled={isAccepting || isDeleting}
											onClick={(event) => {
												event.stopPropagation();
												handleDeleteFriendRequest(notification?.data?.id, index);
											}}
										/>
									</div>
									<div className="flex">
										<div className={`text-xs text-400 flex gap-2`}>
											<div className={`createData-tooltip-${notification?.data?.userId?.id} `}>
												{formatDistanceToNow(new Date(notification?.data?.createdAt), {
													addSuffix: true,
												})}
												<Tooltip
													key={notification?.data?.userId?.id}
													target={`.createData-tooltip-${notification?.data?.userId?.id}`}
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
							)}
						</div>
						<Button
							className="p-button-text  p-button p-component border-circle	p-3 w-2rem h-2rem	"
							icon="pi pi-times"
							size="small"
							disabled={isDeleting}
							onClick={(event) => {
								event.stopPropagation();
								handleDismiss(index);
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
