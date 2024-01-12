import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, setLogout } from "@store/slices/authSlice";

const baseUrl = "http://localhost:3500/";
const baseQuery = fetchBaseQuery({
	baseUrl,
	credentials: "same-origin",
	prepareHeaders: (headers, { getState }) => {
		// Use Redux's useSelector to get the token from the state
		// usually we use local storage but in this case we already setup react-persist
		const token = getState().auth.token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.originalStatus === 403) {
		console.log("sending refresh token");
		// send refresh token to get new access token
		const refreshResult = await baseQuery("/refresh", api, extraOptions);
		console.log(refreshResult);
		if (refreshResult?.data) {
			const user = api.getState().auth.user;
			// store the new token
			api.dispatch(setCredentials({ ...refreshResult.data, user }));
			// retry the original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(setLogout());
		}
	}

	return result;
};

export const api = createApi({
	// defaults to 'api'
	reducerPath: "api",
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({}),
});
