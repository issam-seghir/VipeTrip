import { api } from "@jsx/store/api/api";
import { current } from "immer";

export const postApi = api.enhanceEndpoints({ addTagTypes: ["Post"] }).injectEndpoints({
	endpoints: (builder) => ({
		getAllPosts: builder.query({
			query: () => "posts",
			transformResponse: (response) => response.data,
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "Post", id })), { type: "Post", id: "LIST" }]
					: [{ type: "Post", id: "LIST" }],
		}),
		getPost: builder.query({
			query: (id) => ({
				url: `posts/${id}`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		getPostLikers: builder.query({
			query: (id) => ({
				url: `posts/${id}/likers`,
				method: "GET",
			}),
			transformResponse: (response) => response.data,
			providesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		createPost: builder.mutation({
			query: (body) => ({
				url: `posts`,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Post", id: "LIST" }],
		}),
		updatePost: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `posts/${id}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
		}),
		deletePost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		sharePost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}/share`,
				method: "POST",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		bookmarkPost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}/bookmark`,
				method: "POST",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		likeDislikePost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}/likeDislike`,
				method: "POST",
			}),
			// Optimistique update like button state
			onQueryStarted: (id, { dispatch, queryFulfilled }) => {
				console.log("Mutation started"); // Add this line
				const patchResult = dispatch(
					postApi.util.updateQueryData("getAllPosts", undefined, (draft) => {
						console.log(current(draft));
						try {
							const post = draft.find((post) => post.id === id);
							if (post) {
								post.likedByUser = !post.likedByUser;
								post.totalLikes += post.likedByUser ? 1 : -1;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				// const patchResultGetPost = dispatch(
				// 	postApi.util.updateQueryData("getPost", id, (draft) => {
				// 		if (draft) {
				// 			draft.likedByUser = !draft.likedByUser;
				// 			draft.totalLikes += draft.likedByUser ? 1 : -1;
				// 		}
				// 	})
				// );

				queryFulfilled.catch(() => {
					/**
					 * Alternatively, on failure you can invalidate the corresponding cache tags
					 * to trigger a re-fetch:
					 * dispatch(api.util.invalidateTags(['Post']))
					 */
					patchResult.undo();
					// patchResultGetPost.undo();
				});
			},
		}),
	}),
});

export const {
	useCreatePostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useGetPostQuery,
	useGetAllPostsQuery,
	useLazyGetPostLikersQuery,
	useGetPostLikersQuery,
	useLikeDislikePostMutation,
} = postApi;
