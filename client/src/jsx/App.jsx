import { themeSettings } from "@data/themes/theme";
import { selectMode } from "@jsx/store/slices/globalSlice";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import arLocale from "@data/localization/ar.json";

addLocale("ar", arLocale);

function App() {
	const mode = useSelector(selectMode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const options = {
		// inputStyle: "filled",
		//  zIndex: {
		//     modal: 1100,    // dialog, sidebar
		//     overlay: 1000,  // dropdown, overlaypanel
		//     menu: 1000,     // overlay menus
		//     tooltip: 1100   // tooltip
		// },
		// unstyled: true, //  removes all of components styles in the core
		locale: "en",
		ripple: false,
	};
	return (
		<ThemeProvider theme={theme}>
			<PrimeReactProvider value={options}>
				<Outlet />
			</PrimeReactProvider>
		</ThemeProvider>
	);
}

export default App;
