import { createContext, useContext, useEffect, useRef, useState } from "react";

import { postApi } from "@jsx/store/api/postApi";
import { userApi } from "@jsx/store/api/userApi";
import { selectCurrentToken } from "@store/slices/authSlice";
import { getCookie } from "@utils/index";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children, store }) => {
	const [isConnected, setConnected] = useState(false);
	const [notifications, setNotifications] = useState([]);

	const localToken = useSelector(selectCurrentToken);
	const socialToken = getCookie("socialToken");
	const token = localToken || socialToken;
	// "undefined" means the URL will be computed from the `window.location` object
	// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
	const socketUrl = import.meta.env.VITE_SERVER_URL;

	const socket = useRef(null);

	function handleLikeNotification(notification) {
		console.log(notification);
		setNotifications((prevNotifications) => [...prevNotifications, { ...notification, read: false }]);
	}
	function handleTestResponse(data) {
		console.log("Received response from test Hook:", data);
	}
	function handleDeclinedFriendRequest(data) {
		console.log("handleDeclinedFriendRequest");
		console.log(data);
		store.dispatch(postApi.util.invalidateTags([{ type: "Friends", id: data.friendId }]));
	}
	function handleAcceptedFriendRequest(data) {
		console.log("handleAcceptedFriendRequest");
		console.log(data);
		store.dispatch(postApi.util.invalidateTags([{ type: "Friends", id: data.friendId }]));
	}
	function handleUserOnline({ userId }) {
		console.log("user are online :");
		console.log(userId);
		store.dispatch(userApi.util.invalidateTags([{ type: "User", id: "STATUS" }]));
	}
	function handleUserOffline({ userId }) {
		console.log("user are Offline :");
		console.log(userId);
		store.dispatch(userApi.util.invalidateTags([{ type: "User", id: "STATUS" }]));
	}

	useEffect(() => {
		function onConnect() {
			console.info(`Successfully connected to socket at ${socketUrl}`);
			setConnected(true);
		}

		function onDisconnect() {
			console.info(`Successfully disconnected`);
			setConnected(false);
		}

		function onError(err) {
			console.log("Socket Error:", err.message);
		}

		socket.current = io(socketUrl, {
			extraHeaders: {
				authorization: `Bearer ${token}`,
			},
		});

		socket.current.on("connect", onConnect);
		socket.current.on("disconnect", onDisconnect);
		socket.current.on("error", onError);
		socket.current.on("test Hook", handleTestResponse);
		socket.current.on("notification", handleLikeNotification);
		socket.current.on("friend request declined", handleDeclinedFriendRequest);
		socket.current.on("friend request accepted", handleAcceptedFriendRequest);
		socket.current.on("user online", handleUserOnline);
		socket.current.on("user offline", handleUserOffline);

		return () => {
			socket.current.off("connect", onConnect);
			socket.current.off("disconnect", onDisconnect);
			socket.current.off("error", onError);
			socket.current.off("test Hook", handleTestResponse);
			socket.current.off("notification", handleLikeNotification);
			socket.current.off("friend request declined", handleDeclinedFriendRequest);
			socket.current.off("friend request accepted", handleAcceptedFriendRequest);
			socket.current.off("user online", handleUserOnline);
			socket.current.off("user offline", handleUserOffline);

			// socket.current.disconnect();
			// If you need to close the Socket.IO client when your component is unmounted (for example, if the connection is only needed in a specific part of your application), you should:
		};
	}, []);

	return (
		<SocketContext.Provider value={[socket.current, isConnected, notifications, setNotifications]}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
