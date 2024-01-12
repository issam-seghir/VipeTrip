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
		setLogout: (state) => {
			state.user = null;
			state.token = null;
		}
	},
});


export const selectCurrentUser = (state) => state.auth.user;
export const { setCredentials, setLogout } = authSlice.actions;
export default authSlice.reducer;
