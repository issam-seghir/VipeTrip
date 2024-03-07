import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	mode: "light",
	local: "en", // default language
	theme: "lara-dark-blue", // default theme
};

export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setMode: (state) => {
			state.mode = state.mode === "light" ? "dark" : "light";
		},
		setLocal: (state, action) => {
			state.local = action.payload; // set language
		},
		setTheme: (state, action) => {
			state.theme = action.payload; // set language
		}
	},
});

export const selectMode = (state) => state.store.global.mode;
export const selectLocal = (state) => state.store.global.local; // selector for language
export const selectTheme = (state) => state.store.global.theme; // selector theme

export const { setMode, setLocal,setTheme } = globalSlice.actions;
export default globalSlice.reducer;
