/* eslint-disable unicorn/prefer-spread */
/*global process*/

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@store/api/api";
import authReducer from "@store/slices/authSlice";
import globalReducer from "@store/slices/globalSlice";
import infiniteScrollReducer from "@store/slices/infiniteScrollSlice";
import postReducer from "@store/slices/postSlice";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

//? use redux-persist to store the state in localStorage
//? you can use any other storage as well like sessionStorage or cookies
//* ref : https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/

const rootPersistConfig = {
	key: "store",
	version: 1,
	storage,
	//! It is also strongly recommended to blacklist any api(s) that you have configured with RTK Query.
	//! If the api slice reducer is not blacklisted, the api cache will be automatically persisted
	//! and restored which could leave you with phantom subscriptions from components that do not exist any more.
	blacklist: [api.reducerPath, "post", "infiniteScroll"], //Things u dont want to persist
	/*
		whitelist: ['globalReducer', 'pageReducer',...], //Things u want to persist
	 */
};

const rootReducer = combineReducers({
	auth: authReducer,
	post: postReducer,
	infiniteScroll: infiniteScrollReducer,
	global: globalReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
	reducer: {
		store: persistedReducer,
		[api.reducerPath]: api.reducer, // Include the reducer for the Pokemon API
	},
	// skip console errors for redux-persist
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(api.middleware), // Include the middleware for the auth API,

	devTools: process.env.NODE_ENV !== "production", // Disable DevTools in production
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
export const persistor = persistStore(store);
