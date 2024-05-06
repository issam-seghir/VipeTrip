import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isPostDeletedSuccuss: false,
	isPostRepostedSuccuss: false,
};

export const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPostIsDeletedSuccuss: (state, action) => {
			state.isPostDeletedSuccuss = action.payload;
		},
		setPostIsRepostedSuccuss: (state, action) => {
			state.isPostRepostedSuccuss = action.payload;
		},
	},
});

export const selectPostDeleteSuccuss = (state) => state.store.post.isPostDeletedSuccuss;
export const selectPostRespostedSuccuss = (state) => state.store.post.isPostRepostedSuccuss;

export const { setPostIsDeletedSuccuss, setPostIsRepostedSuccuss } = postSlice.actions;
export default postSlice.reducer;
