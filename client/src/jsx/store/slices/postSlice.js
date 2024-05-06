import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isPostDeletedSuccuss: false,
};

export const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPostIsDeletedSuccuss: (state, action) => {
			state.isPostDeletedSuccuss = action.payload;
		},
	},
});

export const selectPostDeleteSuccuss = (state) => state.store.post.isPostDeletedSuccuss;

export const { setPostIsDeletedSuccuss } = postSlice.actions;
export default postSlice.reducer;
