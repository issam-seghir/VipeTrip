import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3500/auth";

// Create the API using RTK Query
export const authApi = createApi({
	// to select data from the store, you might do something like const data = useSelector((state) => state.authApi).
	// defaults to 'api'
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers, { getState }) => {
			// Use Redux's useSelector to get the token from the state
			// usually we use local storage but in this case we already setup react-persist
			const token = getState().global.token;
			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		apiLogin: builder.mutation({
			query: (credentials) => ({
				url: "login",
				method: "POST",
				body: credentials,
			}),
		}),
		apiRegister: builder.mutation({
			query: (credentials) => ({
				url: "register",
				method: "POST",
				body: credentials,
			}),
		}),
	}),
});

// Export the generated hooks for easy usage
export const { useApiLoginMutation, useApiRegisterMutation } = authApi;

//* explain tags :
/* The providesTags and invalidatesTags options in RTK Query are not added automatically
  because they require knowledge about the specific relationships between your API endpoints, which the library cannot infer on its own.
  For example, if you have a getPokemon query and an updatePokemon mutation,
  you might want to invalidate the getPokemon query whenever the updatePokemon mutation is called,
  to ensure that your app always has the latest data.
  However, RTK Query has no way of knowing that these two endpoints are related unless you tell it by using providesTags and invalidatesTags.
 */
