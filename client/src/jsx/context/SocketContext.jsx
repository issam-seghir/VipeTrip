import { createContext, useContext, useEffect, useRef, useState } from "react";

import { selectCurrentToken } from "@store/slices/authSlice";
import { getCookie } from "@utils/index";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children, store }) => {
	const [isConnected, setConnected] = useState(false);
	const localToken = useSelector(selectCurrentToken);
	const socialToken = getCookie("socialToken");
	const token = localToken || socialToken;

	const socketUrl = import.meta.env.VITE_SERVER_URL;

	const socket = useRef(null);

	const handleOnMessage = (message) => {
		console.log(message);
		// store.dispatch here
	};
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
		if (!isConnected) {
			socket.current = io(socketUrl, {
				extraHeaders: {
					authorization: `Bearer ${token}`,
				},
			});

			socket.	current.on("connect", onConnect);
			socket.current.on("disconnect", onDisconnect);
			socket.current.on("error", onError);

			socket.current.on("message", handleOnMessage);
		}

		return () => {
			socket.current.off("connect", onConnect);
			socket.current.off("disconnect", onDisconnect);
			socket.current.off("error", onError);
			socket.current.off("message", handleOnMessage);
		// If you need to close the Socket.IO client when your component is unmounted (for example, if the connection is only needed in a specific part of your application), you should:
		// socket?.current && socket.disconnect();
		};
	}, []);

	return <SocketContext.Provider value={[socket.current, isConnected]}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
