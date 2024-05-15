import { api } from "@jsx/store/api/api";

export const notificationApi = api.enhanceEndpoints({ addTagTypes: ["Notifications"] }).injectEndpoints({
	endpoints: (builder) => ({
		getAllNotifications: builder.query({
			query: () => `users/me/notifications`,
			transformResponse: (response) => response.data,
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "Notifications", id })), { type: "Notifications", id: "LIST" }]
					: [{ type: "Notifications", id: "LIST" }],
		}),
		getFriendRequest: builder.query({
			query: (id) => `users/me/notifications/${id}`,
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [
				{ type: "Notifications", id },
				{ type: "Notifications", id: "REQUEST" },
			],
		}),
		createFriendRequest: builder.mutation({
			query: (id) => ({
				url: `users/me/notifications/${id}`,
				method: "POST",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Notifications", id }],
		}),
		acceptFriendRequest: builder.mutation({
			query: (id) => ({
				url: `users/me/notifications/notifications-request/${id}`,
				method: "PATCH",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Notifications", id }],
		}),
		deleteFriendRequest: builder.mutation({
			query: (id) => ({
				url: `users/me/notifications/notifications-request/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Notifications", id },
				{ type: "Notifications", id: "REQUEST" },
			],
		}),
		removeFriend: builder.mutation({
			query: (id) => ({
				url: `users/me/notifications/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Notifications", id }],
		}),
	}),
});

export const {
	useGetAllNotificationsQuery,
	useGetFriendRequestQuery,
	useCreateFriendRequestMutation,
	useAcceptFriendRequestMutation,
	useDeleteFriendRequestMutation,
	useRemoveFriendMutation,
} = notificationApi;
