import { api } from "@jsx/store/api/api";

export const postApi = api.injectEndpoints({
	endpoints: (builder) => ({
		newPost: builder.mutation({
			query: (postData) => ({
				url: `/posts`,
				method: "POST",
				body: postData,
			}),
		}),
		getAllPosts: builder.query({
			query: () => ({
				url: `/posts`,
				method: "GET",
			}),
		}),
		getPost: builder.query({
			query: (id) => ({
				url: `/posts/${id}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useNewPostMutation,useGetPostQuery,useGetAllPostsQuery} = postApi;
