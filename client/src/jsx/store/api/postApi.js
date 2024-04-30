import { api } from "@jsx/store/api/api";

export const postApi = api.enhanceEndpoints({ addTagTypes: ["Post"] }).injectEndpoints({
	endpoints: (builder) => ({
		createPost: builder.mutation({
			query: (body) => ({
				url: `posts`,
				method: "POST",
				body,
			}),
		}),
		getAllPosts: builder.query({
			query: () => "posts",
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "Post", id })), { type: "Post", id: "LIST" }]
					: [{ type: "Post", id: "LIST" }],
		}),
		getPost: builder.query({
			query: (id) => ({
				url: `/posts/${id}`,
				method: "GET",
			}),
			providesTags: (result, error, id) => [{ type: "Post", id }],
		}),
		addPost: builder.mutation({
			query: (body) => ({
				url: `posts`,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Post", id: "LIST" }],
		}),
		updatePost: builder.mutation({
			query: ({ id, ...patch }) => ({
				url: `posts/${id}`,
				method: "PUT",
				body: patch,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
		}),
		deletePost: builder.mutation({
			query(id) {
				return {
					url: `posts/${id}`,
					method: "DELETE",
				};
			},
			invalidatesTags: (result, error, id) => [{ type: "Post", id }],
		}),
	}),
});

export const { useCreatePostMutation, useGetPostQuery, useGetAllPostsQuery } = postApi;
