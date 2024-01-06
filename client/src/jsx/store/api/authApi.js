import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


const baseUrl = "http://localhost:3500/api/auth"

// Create the API using RTK Query
export const authApi = createApi({
	// reducerPath : the state that hold the api data  is used as the key in the Redux store ,
	// to select data from the store, you might do something like const data = useSelector((state) => state.authApi).
	// defaults to 'api'
	reducerPath: "authApi",
	// fetchBaseQuery : A small wrapper around fetch
	baseQuery: fetchBaseQuery({ baseUrl }),
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
