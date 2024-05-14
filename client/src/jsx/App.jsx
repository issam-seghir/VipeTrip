import { arLocale } from "@data/localization/ar.js";
import { selectLocal, selectMode, selectTheme } from "@jsx/store/slices/globalSlice";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useSocket } from "@context/SocketContext";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";

addLocale("ar", arLocale);

function App() {
	const mode = useSelector(selectMode);
	// const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const theme = useSelector(selectTheme);
	const local = useSelector(selectLocal);
	const [socket, isConnected] = useSocket();
const toast = useRef(null);
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

	  useEffect(() => {
		   function handleOffline() {
				toast.current.show({
					severity: "info",
					summary: `You are offline. Please check your internet connection.`,
					life: 6000,
				});
			}

			function handleOnline() {
				const condition = navigator.onLine ? "online" : "offline";
				toast.current.show({ severity: "info", summary: `You are back online` });
			}

			window.addEventListener("online", handleOnline);
			window.addEventListener("offline", handleOffline);

			return () => {
				window.removeEventListener("online", handleOnline);
				window.removeEventListener("offline", handleOffline);
			};
		}, []);

	if (isConnected) {
		socket.emit("test Hook", "Test Hook message");
	}

	return (
		<PrimeReactProvider value={primereactConfig}>
			<Toast ref={toast} position="bottom-left" pt={{
				content: "p-4 m-4"
			}} />
			<Outlet />
		</PrimeReactProvider>
	);
}

export default App;
