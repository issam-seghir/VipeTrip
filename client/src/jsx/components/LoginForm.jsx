/* eslint-disable unicorn/better-regex */
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useApiLoginMutation, useApiRegisterMutation } from "@store/api/authApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormTextField from "@components/FormTextField";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ----------------- Schema Validation ------------------

const registerSchema = z
	.object({
		firstName: z.string().min(1, "This is a required field").trim().min(3).max(15),
		lastName: z.string().min(1, "This is a required field").min(3).max(15),
		email: z.string().min(1, "This is a required field").email().trim().toLowerCase().min(3).max(20),
		password: z
			.string()
			.min(1, "This is a required field")
			.min(8, "Password should be at least 8 characters")
			.max(100, "Password should not exceed 100 characters")
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@#])[\d!$%&*?@#A-Za-z]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
		confirmPassword: z.string().min(1, "This is a required field"),
		location: z.string().max(100).optional(),
		job: z.string().max(100).optional(),
		picture: z.string().url({ message: "Picture must be a valid URL" }).optional().or(z.literal("")), // fix optional for url / email ...,
	})
	.refine((data) => data.password === data.confirmPassword, {
		//For advanced features - multiple issues ,  see (superRefine)
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

const loginSchema = z.object({
	email: z.string().min(1, "This is a required field").trim().toLowerCase(),
	password: z.string().min(1, "This is a required field"),
});

export default function LoginForm() {
	const [isLogin, setIsLogin] = useState(true);
	const [apiLogin, { data: loginData, error: loginError, isLoading: isLoginLoading, isSuccess: isLoginSuccess, isError: isLoginError }] = useApiLoginMutation();
	const [apiRegister, { data: registerData, error: registerError, isLoading: isRegisterLoading, isSuccess: isRegisterSuccess, isError: isRegisterError }] = useApiRegisterMutation();
	const { palette } = useTheme();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const {
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm({
		mode: "onBlur", // when to validate the form
		resolver: zodResolver(isLogin ? loginSchema : registerSchema),
	});

	console.log("login message " + JSON.stringify(loginError?.data));
	console.log("register message " + JSON.stringify(registerError?.data));
	console.log("login data " + loginData);
	console.log("register data " + registerData);
	console.log(errors);

	const onSubmit = (data) => {
		isLogin ? apiLogin(data) : apiRegister(data);
	};

	// reset form when submit is successful (keep default values)
	useEffect(() => {
		if ((isLoginSuccess || isRegisterSuccess) && isSubmitSuccessful) {
			reset();
		}
	}, [isLoginSuccess, isRegisterSuccess, isSubmitSuccessful, reset]);

	// redirect to home page after successful login
	useEffect(() => {
		if (isLoginSuccess) {
			navigate("/home");
		}
	}, [isLoginSuccess, navigate]);

	return (
		<>
			{import.meta.env.DEV && <DevTool control={control} placement="top-left" />}
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
					sx={{
						"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
					}}
				>
					{!isLogin && (
						<>
							<FormTextField defaultValue="" name={"firstName"} label="First Name" control={control} sx={{ gridColumn: "span 2" }} />
							<FormTextField defaultValue="" name={"lastName"} label="last Name" control={control} sx={{ gridColumn: "span 2" }} />
							<FormTextField defaultValue="" name={"location"} label="Location" control={control} sx={{ gridColumn: "span 4" }} />
							<FormTextField defaultValue="" name={"job"} label="Job" control={control} sx={{ gridColumn: "span 4" }} />
							<FormTextField defaultValue="" name={"picture"} label="Picture URL" control={control} sx={{ gridColumn: "span 4" }} />
						</>
					)}
					<FormTextField defaultValue={"admin@test.com"} name={"email"} label="Email" control={control} sx={{ gridColumn: "span 4" }} />
					<FormTextField defaultValue={"123456@Admin"} name={"password"} label="Password" type="password" control={control} sx={{ gridColumn: "span 4" }} />
					{!isLogin && <FormTextField defaultValue="" name={"confirmPassword"} label="Confirm Password" type="password" control={control} sx={{ gridColumn: "span 4" }} />}
				</Box>

				{/* BUTTONS */}
				<Box>
					<Button
						fullWidth
						disabled={isSubmitting || isRegisterLoading || isLoginLoading} // disabled the button when submitting
						type="submit"
						sx={{
							m: "2rem 0",
							p: "1rem",
							backgroundColor: palette.primary.main,
							color: palette.background.alt,
							"&:hover": { color: palette.primary.main },
						}}
					>
						{isLoginLoading || isRegisterLoading ? "Loading..." : isLogin ? "LOGIN" : "REGISTER"}
					</Button>
					{/* switch between login and register form */}
					<Typography
						onClick={() => {
							setIsLogin((prev) => {
								// Reset the form fields when switching between login and register form
								reset({
									email: prev ? "" : "admin@test.com",
									password: prev ? "" : "123456@Admin",
									// Add other fields here if necessary
								});
								return !prev;
							});
						}}
						sx={{
							textDecoration: "underline",
							color: palette.primary.main,
							"&:hover": {
								cursor: "pointer",
								color: palette.primary.light,
							},
						}}
					>
						{isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login here."}
					</Typography>
					{/* error message */}
					<Typography align="center" variant="h3" sx={{ color: palette.error.main, mt: 5 }}>
						{isLoginError && <div>{loginError?.error}</div>}
						{isRegisterError && <div>Error: {registerError?.error}</div>}
					</Typography>
				</Box>
			</form>
		</>
	);
}
