import { arLocale } from "@data/localization/ar.js";
import { selectLocal, selectMode, selectTheme } from "@jsx/store/slices/globalSlice";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
// import { socket } from "./socket";

import { useSocket } from "@context/SocketContext";
import { useSocketEvent } from "@jsx/hooks/useSocketEvent";

addLocale("ar", arLocale);

function App() {
	const mode = useSelector(selectMode);
	// const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const theme = useSelector(selectTheme);
	const local = useSelector(selectLocal);
	// const [socket, isConnected] = useSocket();
	// const [listenToEvent, emitEvent] = useSocketEvent(socket);

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
	// function handleTestResponse(data) {
	// 	console.log("Received response from test Hook:", data);
	// }
	// listenToEvent("test Hook", handleTestResponse);
	// emitEvent("test Hook", "Test Hook message");

	return (
		<PrimeReactProvider value={primereactConfig}>
			<Outlet />
		</PrimeReactProvider>
	);
}

export default App;
