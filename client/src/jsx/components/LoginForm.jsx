/* eslint-disable unicorn/better-regex */
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useApiLoginMutation, useApiRegisterMutation } from "@store/api/authApi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import { setLogin } from "state";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//TODO: fix confirm password error message (not showing :refine)
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
	const [apiLogin, {data: loginData, error: loginError ,isLoading: isLoginLoading, isSuccess: isLoginSuccess, isError: isLoginError}] = useApiLoginMutation();
	const [apiRegister, {registerData, isLoading: isRegisterLoading, isSuccess: isRegisterSuccess }] = useApiRegisterMutation();
	const { palette } = useTheme();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
console.log("login error " + isLoginError ? loginError?.toString() : "no error");
console.log("login data "+ loginData);
	const onSubmit = (data) => {
			isLogin ? apiLogin(data) : apiRegister(data);

	};

	//TODO : add default values for login and register (admin for testing)

	const {
		register,
		handleSubmit,
		reset, // clear the form ( for example after successful submit)
		control,
		formState: { errors, isSubmitSuccessful, isSubmitted, isSubmitting },
	} = useForm({
		mode: "onBlur", // when to validate the form
		resolver: zodResolver(isLogin ? loginSchema : registerSchema),
	});

	// reset form when submit is successful (keep default values)
	useEffect(() => {
		if ((isLoginSuccess || isRegisterSuccess) && isSubmitSuccessful) {
			reset();
		}
	}, [isLoginSuccess, isRegisterSuccess, isSubmitSuccessful, reset]);

	// redirect to home page after successful login
	useEffect(() => {
		if (isLoginSuccess) {
			navigate("/home"); // replace '/home' with the actual path of your home route
		}
	}, [isLoginSuccess, navigate]);

	console.log(errors);

	return (
		/* "handleSubmit" will validate your inputs before invoking "onSubmit" */
		<>
			<DevTool control={control} placement="top-left" />
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
							<Controller defaultValue="" name="firstName" control={control} render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="First Name" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 2" }} />} />
							<Controller defaultValue="" name="lastName" control={control} render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="last Name" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 2" }} />} />
							<Controller defaultValue="" name="location" control={control} render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="Location" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 4" }} />} />
							<Controller defaultValue="" name="job" control={control} render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="Job" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 4" }} />} />
							<Controller defaultValue="" name="picture" control={control} render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="Picture" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 4" }} />} />
						</>
					)}

					<Controller
						defaultValue="test@gmail.com"
						rules={{ required: "email  is required" }}
						name="email"
						control={control}
						render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="Email" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 4" }} />}
					/>

					{/* <TextField {...register("email")} label="Email" error={!!errors.email} helperText={errors.email?.message} sx={{ gridColumn: "span 4" }} /> */}
					<TextField {...register("password")} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message || errors.password?.password?.message} sx={{ gridColumn: "span 4" }} />
					{!isLogin && <TextField {...register("confirmPassword")} label="Confirm Password" type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ gridColumn: "span 4" }} />}
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
						{isLogin ? "LOGIN" : "REGISTER"}
						{isLoginLoading && "Loading..."}
					</Button>
					{isLoginError &&  loginError.status &&JSON.stringify(loginError.data)}
					{/* {isRegisterError && <div>Error: {registerError.message}</div>} */}
					<Typography
						onClick={() => {
							setIsLogin((prev) => !prev);
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
				</Box>
			</form>
		</>
	);
}
