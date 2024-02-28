import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	mode: "light",
	posts: [],
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
			state.local = action.payload; // set language
		},
		setFriends: (state, action) => {
			if (state.user) {
				state.user.friends = action.payload.friends;
			} else {
				console.error("user friends non-existent :(");
			}
		},
		setPosts: (state, action) => {
			state.posts = action.payload.posts;
		},
		setPost: (state, action) => {
			const updatedPosts = state.posts.map((post) => {
				if (post._id === action.payload.post._id) return action.payload.post;
				return post;
			});
			state.posts = updatedPosts;
		},
	},
});

export const selectMode = (state) => state.global.mode;
export const selectLocal = (state) => state.global.local; // selector for language
export const selectTheme = (state) => state.global.theme; // selector theme

export const { setMode, setLocal,setTheme, setFriends, setPosts, setPost } = globalSlice.actions;
export default globalSlice.reducer;
