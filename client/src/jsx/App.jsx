import { arLocale } from "@data/localization/ar.js";
import { selectLocal, selectMode, selectTheme } from "@jsx/store/slices/globalSlice";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

// Listen for the 'user online' event
socket.on('user online', (data) => {
  console.log(`User ${data.userId} is online`);
  // You can update your UI here to reflect that the user is online
});

// Listen for the 'user offline' event
socket.on('user offline', (data) => {
  console.log(`User ${data.userId} is offline`);
  // You can update your UI here to reflect that the user is offline
});
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

	return (
		// <ThemeProvider theme={theme}>
		<PrimeReactProvider value={primereactConfig}>
			<Outlet />
		</PrimeReactProvider>
		// </ThemeProvider>
	);
}

export default App;
