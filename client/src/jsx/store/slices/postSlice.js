import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isPostDeletedSuccuss: false,
	isPostRepostedSuccuss: false,
	postDialogForm: { open: false, id: null },
	postCommentsDialog: { open: false, id: null },
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
		setPostDialogForm: (state, action) => {
			state.postDialogForm = action.payload;
		},
		setPostCommentsDialog: (state, action) => {
			state.postCommentsDialog = action.payload;
		},
	},
});

export const selectPostDeleteSuccuss = (state) => state.store.post.isPostDeletedSuccuss;
export const selectPostRespostedSuccuss = (state) => state.store.post.isPostRepostedSuccuss;
export const selectPostDialogForm = (state) => state.store.post.postDialogForm;
export const selectPostCommentsDialog = (state) => state.store.post.postCommentsDialog;

export const { setPostIsDeletedSuccuss, setPostIsRepostedSuccuss, setPostCommentsDialog, setPostDialogForm } =
	postSlice.actions;
export default postSlice.reducer;
