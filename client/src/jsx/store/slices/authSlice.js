import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	token: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		clearCredentials: (state, action) => {
			state.user = null;
			state.token = null;
		},
	},
});


export const selectCurrentUser = (state) => state.store.authe.auth.user;
export const selectCurrentToken = (state) => state.store.auth.token;
export const { setCredentials,clearCredentials } = authSlice.actions;
export default authSlice.reducer;
