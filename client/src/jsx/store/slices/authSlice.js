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
		 bookmarkPost: (state, action) => {
                 if (state.user) {
                state.user.bookmarkedPosts = [...(state.user.bookmarkedPosts || []), action.payload];
            }
        },
        unbookmarkPost: (state, action) => {
            if (state.user) {
                state.user.bookmarkedPosts = (state.user.bookmarkedPosts || []).filter(post => post !== action.payload);
            }
        },
	},
});

export const selectCurrentUser = (state) => state.store.auth.user;
export const selectCurrentToken = (state) => state.store.auth.token;
export const { setCredentials, clearCredentials, bookmarkPost, unbookmarkPost } = authSlice.actions;
export default authSlice.reducer;
