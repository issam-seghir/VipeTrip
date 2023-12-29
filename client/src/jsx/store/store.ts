import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
// import counterReducer from "../store/slices/counter/counterSlice"
// import { pokemonApi } from "../Api/PokemonAPI"; // Import the Pokemon API
// import postsReducer from "./slices/posts/postsSlice"
// import userReducer from "./slices/user/usersSlice";


export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    // counter: counterReducer,
    // posts: postsReducer,
    // users: userReducer,
    // [pokemonApi.reducerPath]: pokemonApi.reducer, // Include the reducer for the Pokemon API
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(pokemonApi.middleware), // Include the middleware for the Pokemon API
})



export type StoreDispatch = typeof store.dispatch
export type StoreState = ReturnType<typeof store.getState>
export type StoreThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  StoreState,
  unknown,
  Action<string>
>
