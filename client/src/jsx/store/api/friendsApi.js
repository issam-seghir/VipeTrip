import { api } from "@jsx/store/api/api";

export const friendsApi = api.enhanceEndpoints({ addTagTypes: ["Friends"] }).injectEndpoints({
	endpoints: (builder) => ({
		getAllFriends: builder.query({
			query: () => `users/me/friends`,
			transformResponse: (response) => response.data,
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "Friends", id })), { type: "Friends", id: "LIST" }]
					: [{ type: "Friends", id: "LIST" }],
		}),
		getFriendRequest: builder.query({
			query: (id) => `users/me/friends/${id}`,
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: "Friends", id }],
		}),
		createFriendRequest: builder.mutation({
			query: (id) => ({
				url: `users/me/friends/${id}`,
				method: "POST",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Friends", id }],
		}),
		acceptFriendRequest: builder.mutation({
			query: (id) => ({
				url: `users/me/friends/${id}`,
				method: "PATCH",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Friends", id: "LIST" }],
		}),
		deleteFriendRequest: builder.mutation({
			query: (id) => ({
				url: `users/me/friends/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Friends", id }],
		}),
		removeFriend: builder.mutation({
			query: (id) => ({
				url: `users/me/friends/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Friends", id: "LIST" }],
		}),
	}),
});

export const {
	useGetAllFriendsQuery,
	useGetFriendRequestQuery,
	useCreateFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useDeleteFriendRequestMutation,
	useRemoveFriendMutation,
} = friendsApi;
