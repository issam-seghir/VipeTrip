import { themeSettings } from "@data/themes/theme";
import { selectMode } from "@jsx/store/slices/globalSlice";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function App() {
	const mode = useSelector(selectMode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const isAuth = Boolean(useSelector((state) => state.global.token));

	return (
		<ThemeProvider theme={theme}>
			<Outlet />
		</ThemeProvider>
	);
}

export default App;
