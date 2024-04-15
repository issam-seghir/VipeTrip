import { api } from "@jsx/store/api/api";

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
		}),
		googleLogin: builder.query({
			query: () => ({
				url: `/auth/login/google`,
				method: "GET",
			}),
		}),
		facebookLogin: builder.query({
			query: () => ({
				url: `/auth/login/facebook`,
				method: "GET",
			}),
		}),
		linkedinLogin: builder.query({
			query: () => ({
				url: `/auth/login/linkedin`,
				method: "GET",
			}),
		}),
		twitterLogin: builder.query({
			query: () => ({
				url: `/auth/login/twitter`,
				method: "GET",
			}),
		}),
		githubLogin: builder.query({
			query: () => ({
				url: `/auth/login/github`,
				method: "GET",
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
		}),
		register: builder.mutation({
			query: (userData) => ({
				url: "/auth/register",
				method: "POST",
				body: userData,
			}),
		}),
		checkEmailExists: builder.query({
			query: (email) => ({
				url: `/auth/check-email?email=${email}`,
				method: "GET",
			}),
			extraOptions: {
				skipCache: true,
			},
		}),
		passwordResetRequest: builder.mutation({
			query: (email) => ({
				url: "/auth/forget",
				method: "POST",
				body: email,
			}),
		}),
		passwordReset: builder.mutation({
			query: (credentials) => ({
				url: `/auth/reset`,
				method: "POST",
				body: credentials,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useCheckEmailExistsQuery,
	usePasswordResetRequestMutation,
	usePasswordResetMutation,
	useGoogleLoginQuery
} = authApi;
