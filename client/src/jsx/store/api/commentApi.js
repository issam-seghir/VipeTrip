import { api } from "@jsx/store/api/api";
import { current } from "immer";

export const commentApi = api.enhanceEndpoints({ addTagTypes: ["Comment"] }).injectEndpoints({
	endpoints: (builder) => ({
		getAllComments: builder.query({
			query: () => "comments",
			transformResponse: (response) => response.data,
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "Comment", id })), { type: "Comment", id: "LIST" }]
					: [{ type: "Comment", id: "LIST" }],
		}),
		getComment: builder.query({
			query: (id) => ({
				url: `comments/${id}`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: "Comment", id }],
		}),
		getCommentLikers: builder.query({
			query: (id) => ({
				url: `comments/${id}/likers`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: "Comment", id }],
		}),
		createComment: builder.mutation({
			query: (body) => ({
				url: `comments`,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
		}),
		updateComment: builder.mutation({
			query: ({ id, data }) => ({
				url: `comments/${id}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Comment", id }],
		}),
		deleteComment: builder.mutation({
			query: (id) => ({
				url: `comments/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Comment", id }],
		}),
		likeDislikeComment: builder.mutation({
			query: (id) => ({
				url: `comments/${id}/likeDislike`,
				method: "Comment",
			}),
			// Optimistique update like button state
			onQueryStarted: (id, { dispatch, queryFulfilled }) => {
				console.log("Mutation started : Optimistique update for like button");
				const patchResult = dispatch(
					commentApi.util.updateQueryData("getAllComments", undefined, (draft) => {
						console.log(current(draft));
						try {
							const comment = draft.find((comment) => comment.id === id);
							if (comment) {
								comment.likedByUser = !comment.likedByUser;
								comment.totalLikes += comment.likedByUser ? 1 : -1;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				queryFulfilled.catch(() => {
					patchResult.undo();
				});
			},
		}),
	}),
});

export const {
	useCreateCommentMutation,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
	useGetAllCommentsQuery,
	useGetCommentQuery,
	useGetCommentLikersQuery,
	useLikeDislikeCommentMutation,
} = commentApi;
