import { api } from "@jsx/store/api/api";

export const userApi = api.injectEndpoints({
	// get user by id query
	endpoints: (builder) => ({
		getUserById: builder.query({
			query: (id) => ({
				url: `/users/${id}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useGetUserByIdQuery ,useLazyGetUserByIdQuery } = userApi;
