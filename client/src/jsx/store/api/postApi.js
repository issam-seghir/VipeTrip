import { api } from "@jsx/store/api/api";
import { store } from "@jsx/store/store";
import { current } from "immer";
import { userApi } from "@jsx/store/api/userApi";
export const postApi = api.enhanceEndpoints({ addTagTypes: ["Post"] }).injectEndpoints({
	endpoints: (builder) => ({
		getAllPosts: builder.query({
			query: ({ page = 1, limit = 5 }) => `posts?page=${page}&limit=${limit}`,
			// transformResponse: (response) => response.data,
			providesTags: (result) =>
				result
					? [...result.data.map(({ id }) => ({ type: "Post", id })), { type: "Post", id: "LIST" }]
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
			query: ({ id, data }) => ({
				url: `posts/${id}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Post", id },
				{ type: "User", id: "LIST" },
			],
		}),
		deletePost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Post", id },
				{ type: "User", id: "LIST" },
			],
		}),
		repostPost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}/repost`,
				method: "POST",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		bookmarkPost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}/bookmark`,
				method: "POST",
			}),
			invalidatesTags: (result, error, id) => [{ type: "User", id: "LIST" }],

			// Optimistic update when bookmark button is clicked
			onQueryStarted: (id, { dispatch, queryFulfilled }) => {
				const state = store.getState();
				const page = state.store.infiniteScroll.page;
				const limit = state.store.infiniteScroll.limit;

				console.log("Mutation started : Optimistique update for Bookmark button");

				// Optimistically update the posts
				const patchResultPrevPage = dispatch(
					postApi.util.updateQueryData("getAllPosts", { page: page - 1, limit }, (draft) => {
						console.log(current(draft.data));
						try {
							const post = draft.data.find((post) => post.id === id);
							if (post) {
								post.bookmarkedByUser = !post.bookmarkedByUser;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				const patchResult = dispatch(
					postApi.util.updateQueryData("getAllPosts", { page, limit }, (draft) => {
						console.log(current(draft.data));
						try {
							const post = draft.data.find((post) => post.id === id);
							if (post) {
								post.bookmarkedByUser = !post.bookmarkedByUser;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				const patchResultNextPage = dispatch(
					postApi.util.updateQueryData("getAllPosts", { page: page + 1, limit }, (draft) => {
						console.log(current(draft.data));
						try {
							const post = draft.data.find((post) => post.id === id);
							if (post) {
								post.bookmarkedByUser = !post.bookmarkedByUser;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				const patchResultGetPost = dispatch(
					postApi.util.updateQueryData("getPost", id, (draft) => {
						if (draft) {
							draft.bookmarkedByUser = !draft.bookmarkedByUser;
						}
					})
				);
				queryFulfilled.catch(() => {
					patchResultPrevPage.undo();
					patchResult.undo();
					patchResultNextPage.undo();
					patchResultGetPost.undo();
				});
			},
		}),
		likeDislikePost: builder.mutation({
			query: (id) => ({
				url: `posts/${id}/likeDislike`,
				method: "POST",
			}),
			// Optimistique update like button state
			onQueryStarted: (id, { dispatch, queryFulfilled }) => {
				const state = store.getState();
				const page = state.store.infiniteScroll.page;
				const limit = state.store.infiniteScroll.limit;

				console.log("Mutation started : Optimistique update for like button");
				const patchResultPrevPage = dispatch(
					postApi.util.updateQueryData("getAllPosts", { page: page - 1, limit }, (draft) => {
						console.log(current(draft));
						try {
							const post = draft.data.find((post) => post.id === id);
							if (post) {
								post.likedByUser = !post.likedByUser;
								post.totalLikes += post.likedByUser ? 1 : -1;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				const patchResult = dispatch(
					postApi.util.updateQueryData("getAllPosts", { page, limit }, (draft) => {
						console.log(current(draft));
						try {
							const post = draft.data.find((post) => post.id === id);
							if (post) {
								post.likedByUser = !post.likedByUser;
								post.totalLikes += post.likedByUser ? 1 : -1;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);
				const patchResultNextPage = dispatch(
					postApi.util.updateQueryData("getAllPosts", { page: page + 1, limit }, (draft) => {
						console.log(current(draft));
						try {
							const post = draft.data.find((post) => post.id === id);
							if (post) {
								post.likedByUser = !post.likedByUser;
								post.totalLikes += post.likedByUser ? 1 : -1;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);

				const patchResultGetPost = dispatch(
					postApi.util.updateQueryData("getPost", id, (draft) => {
						if (draft) {
							draft.likedByUser = !draft.likedByUser;
							draft.totalLikes += draft.likedByUser ? 1 : -1;
						}
					})
				);
				const patchResultCurrentUserPosts = dispatch(
					userApi.util.updateQueryData("getCurrentUser", undefined, (draft) => {
						console.log(current(draft));
						try {
							const bookmarkedPost = draft.bookmarkedPosts.find((post) => post.id === id);
							console.log(id);
							console.log(current(bookmarkedPost));
							if (bookmarkedPost) {
								bookmarkedPost.likedByUser = !bookmarkedPost.likedByUser;
								bookmarkedPost.totalLikes += bookmarkedPost.likedByUser ? 1 : -1;
							}
						} catch (error) {
							console.error(error);
						}
					})
				);

				queryFulfilled.catch(() => {
					/**
					 * Alternatively, on failure you can invalidate the corresponding cache tags
					 * to trigger a re-fetch:
					 * dispatch(api.util.invalidateTags(['Post']))
					 */
					patchResultPrevPage.undo();
					patchResult.undo();
					patchResultNextPage.undo();
					patchResultGetPost.undo();
					patchResultCurrentUserPosts.undo();
				});
			},
		}),
	}),
});

export const {
	useCreatePostMutation,
	useRepostPostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useGetPostQuery,
	useGetAllPostsQuery,
	useLazyGetPostLikersQuery,
	useGetPostLikersQuery,
	useBookmarkPostMutation,
	useLikeDislikePostMutation,
} = postApi;
