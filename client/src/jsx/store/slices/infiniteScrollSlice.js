import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	page: 1,
	limit: 5,
};

export const infiniteScrollSlice = createSlice({
	name: "infiniteScroll",
	initialState,
	reducers: {
		setPage: (state, action) => {
			state.page = action.payload;
		},
		setLimit: (state, action) => {
			state.limit = action.payload;
		},
	},
});

export const selectPage = (state) => state.store.infiniteScroll.page;
export const selectLimit = (state) => state.store.infiniteScroll.limit;
export const { setLimit, setPage } = infiniteScrollSlice.actions;
export default infiniteScrollSlice.reducer;
