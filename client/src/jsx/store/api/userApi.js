import { api } from "@jsx/store/api/api";

export const userApi = api.enhanceEndpoints({ addTagTypes: ["User"] }).injectEndpoints({
	// get user by id query
	endpoints: (builder) => ({
		getUserById: builder.query({
			query: (id) => ({
				url: `/users/${id}`,
				method: "GET",
			}),
		}),
		getCurrentUser: builder.query({
			query: () => `users/me`,
			transformResponse: (response) => response.data,
			providesTags: (result, error) => [{ type: "User", id: "LIST" }],
		}),
	}),
});

export const { useGetUserByIdQuery, useGetCurrentUserQuery } = userApi;
