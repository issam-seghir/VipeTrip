import { api } from "@jsx/store/api/api";
import { current } from "immer";

export const commentApi = api.enhanceEndpoints({ addTagTypes: ["Comment"] }).injectEndpoints({
	endpoints: (builder) => ({
		getAllComments: builder.query({
			query: (postId) => `posts/${postId}/comments`,
			transformResponse: (response) => response.data,
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "Comment", id })), { type: "Comment", id: "LIST" }]
					: [{ type: "Comment", id: "LIST" }],
		}),
		getComment: builder.query({
			query: ({ postId, commentId }) => ({
				url: `posts/${postId}/comments/${commentId}`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: "Comment", id }],
		}),
		createComment: builder.mutation({
			query: ({ postId, data }) => ({
				url: `posts/${postId}/comments`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
		}),
		updateComment: builder.mutation({
			query: ({ postId, commentId, data }) => ({
				url: `posts/${postId}/comments/${commentId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Comment", id }],
		}),
		deleteComment: builder.mutation({
			query: ({ postId, commentId }) => ({
				url: `posts/${postId}/comments/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, { postId, commentId }) => [{ type: "Comment", commentId }],
		}),
		likeDislikeComment: builder.mutation({
			query: ({ postId, commentId }) => ({
				url: `posts/${postId}/comments/${commentId}/likeDislike`,
				method: "Comment",
			}),
			// Optimistique update like button state
			onQueryStarted: ({ postId, commentId }, { dispatch, queryFulfilled }) => {
				console.log("Mutation started : Optimistique update for like button");
				const patchResult = dispatch(
					commentApi.util.updateQueryData("getAllComments", postId, (draft) => {
						console.log(current(draft));
						try {
							const comment = draft.find((comment) => comment.id === commentId);
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
	useLikeDislikeCommentMutation,
} = commentApi;
