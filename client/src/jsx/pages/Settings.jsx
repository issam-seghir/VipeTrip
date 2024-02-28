import { arLocale } from "@data/localization/ar.js";
import { themeSettings } from "@data/themes/theme";
import { selectLocal, selectMode, setLocal, setTheme, selectTheme } from "@jsx/store/slices/globalSlice";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { PrimeReactContext, PrimeReactProvider, addLocale } from "primereact/api";
import { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export  function Settings() {
	const mode = useSelector(selectMode);
	const theme = useSelector(selectTheme);
	const local = useSelector(selectLocal);
	const dispatch = useDispatch();
	const [date, setDate] = useState(null);
	const [checked, setChecked] = useState(false);
	const [products, setProducts] = useState([{ code: "bla", name: "test", category: "test", quantity: 1 }]);
	const HTML_LINK_ELEMENT_ID = import.meta.env.VITE_HTML_LINK_ELEMENT_ID;

	const { changeTheme } = useContext(PrimeReactContext);
	const handleLocalChange = (event) => {
		dispatch(setLocal(event.target.value));
	};
	const handleThemeChange = (event) => {
		const newTheme = event.target.value;
		const currentTheme = theme; // assuming `theme` is the current theme
		console.log("currentTheme", currentTheme);
		console.log("newTheme", newTheme);

		console.log("linkElementId", HTML_LINK_ELEMENT_ID);
		changeTheme(currentTheme, newTheme, HTML_LINK_ELEMENT_ID, () => {
			console.log("Theme switched successfully");
			dispatch(setTheme(newTheme));
		});
	};
	return (
		<>
			{/* <div>
				<label htmlFor="language-select">Choose a language:</label>
				<select id="language-select" value={local} onChange={handleLocalChange}>
					<option value="en">English</option>
					<option value="ar">Arabic</option>
				</select>
			</div> */}
			<div className="card flex justify-content-center">
				<Calendar value={date} onChange={(e) => setDate(e.value)} />
			</div>
			<div className="card flex justify-content-center">
				<Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
				<Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
				<Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
			</div>
			<div className="card">
				<DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
					<Column field="code" header="Code"></Column>
					<Column field="name" header="Name"></Column>
					<Column field="category" header="Category"></Column>
					<Column field="quantity" header="Quantity"></Column>
				</DataTable>
			</div>
			<div>
				<label htmlFor="theme-select">Choose a theme:</label>
				<select id="theme-select" value={theme} onChange={handleThemeChange}>
					<option value="lara-light-blue">lara-light-blue</option>
					<option value="lara-dark-blue">lara-dark-blue</option>
					<option value="luna-blue">luna-blue</option>
				</select>
			</div>
		</>
	);
}
