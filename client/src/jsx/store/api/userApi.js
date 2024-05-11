import { api } from "@jsx/store/api/api";

export const userApi = api.enhanceEndpoints({ addTagTypes: ["User"] }).injectEndpoints({
	// get user by id query
	endpoints: (builder) => ({
		getUser: builder.query({
			query: (id) => ({
				url: `/users/${id}`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, { id }) => [{ type: "User", id }],
		}),
		getUserPosts: builder.query({
			query: (id) => ({
				url: `/users/${id}/posts`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, { id }) => [{ type: "User", id }],
		}),
		getCurrentUser: builder.query({
			query: () => `users/me`,
			transformResponse: (response) => response.data,
			providesTags: (result, error) => [{ type: "User", id: "LIST" }],
		}),
		getCurrentUserPosts: builder.query({
			query: () => `users/me/posts`,
			transformResponse: (response) => response.data,
			providesTags: (result, error) => [{ type: "User", id: "LIST" }],
		}),
		updateUserProfile: builder.mutation({
			query: (data) => ({
				url: `users/me/profile`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (result, error) => [{ type: "User", id: "LIST" }],
		}),
	}),
});

export const { useGetUserQuery, useGetCurrentUserQuery,useGetCurrentUserPostsQuery,useGetUserPostsQuery, useUpdateUserProfileMutation } = userApi;
