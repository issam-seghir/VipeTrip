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
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useCheckEmailExistsQuery,
	usePasswordResetRequestMutation,
} = authApi;
