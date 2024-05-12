import { arLocale } from "@data/localization/ar.js";
import { selectLocal, selectMode, selectTheme } from "@jsx/store/slices/globalSlice";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
// import { socket } from "./socket";

import { selectCurrentToken } from "@store/slices/authSlice";
import { getCookie } from "@utils/index";
import io from "socket.io-client";

addLocale("ar", arLocale);

function App() {
	const mode = useSelector(selectMode);
	// const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const theme = useSelector(selectTheme);
	const local = useSelector(selectLocal);
	const dispatch = useDispatch();
	const primereactConfig = {
		// inputStyle: "filled",
		//  zIndex: {
		//     modal: 1100,    // dialog, sidebar
		//     overlay: 1000,  // dropdown, overlaypanel
		//     menu: 1000,     // overlay menus
		//     tooltip: 1100   // tooltip
		// },
		// unstyled: true, //  removes all of components styles in the core
		// locale: "en",
		locale: local,
		ripple: false,
	};

	// "undefined" means the URL will be computed from the `window.location` object
	// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

	const localToken = useSelector(selectCurrentToken);
	const socialToken = getCookie("socialToken");
	const token = localToken || socialToken;
	const socket = io(import.meta.env.VITE_SERVER_URL, {
		extraHeaders: {
			authorization: `Bearer ${token}`,
		},
	});

	socket.on("connect_error", (err) => {
		console.log(err); // not authorized
		console.log(err); // { content: "Please retry later" }
	});

	const [isConnected, setIsConnected] = useState(socket.connected);
	const [fooEvents, setFooEvents] = useState([]);

	useEffect(() => {
		// named functions, so calling socket.off() only removes this specific listener:
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		function onFooEvent(value) {
			setFooEvents((previous) => [...previous, value]);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("foo", onFooEvent);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("foo", onFooEvent);
		};
	}, []);

	console.log(isConnected);

	return (
		<PrimeReactProvider value={primereactConfig}>
			<Outlet />
		</PrimeReactProvider>
	);
}

export default App;
