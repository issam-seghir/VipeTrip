import { api } from "@jsx/store/api/api";

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
			providesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		getLikeState: builder.query({
			query: (id) => ({
				url: `posts/${id}/likeDislike`,
				method: "GET",
			}),
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
			invalidatesTags: (result, error, id) => [{ type: "Post", id }],
		}),
	}),
});

export const {
	useCreatePostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	useGetPostQuery,
	useGetAllPostsQuery,
	useLikeDislikePostMutation,
	useGetLikeStateQuery
} = postApi;
