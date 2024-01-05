/* eslint-disable unicorn/better-regex */
import { useForm, Form, Controller } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "@store/slices/globalSlice";

// import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "@components/FlexBetween";

import { z } from "zod";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";

//TODO: fix confirm password error message (not showing :refine)
const registerSchema = z
	.object({
		firstName: z.string().trim().min(3).max(15),
		lastName: z.string().min(3).max(15),
		email: z.string().email().trim().toLowerCase().min(3).max(20),
		password: z
			.string()
			.min(8, "Password should be at least 8 characters")
			.max(100, "Password should not exceed 100 characters")
			.refine((password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@#])[\d!$%&*?@#A-Za-z]{8,}$/.test(password), {
				message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				path: ["password"],
			}),
		confirmPassword: z.string(),
		location: z.string().max(100).optional(),
		job: z.string().max(100).optional(),
		picture: z.string().url({ message: "Picture must be a valid URL" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
const loginSchema = z.object({
	email: z.string().trim().toLowerCase(),
	password: z.string(),
});

let renderCount = 0;
export default function LoginForm() {
	const [isLogin, setIsLogin] = useState(true);
	const [submitError, setSubmitError] = useState(null);
	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	renderCount++;
	console.log(renderCount);

	const handleRegister = async (data) => {
		try {
			const savedUserResponse = await fetch("http://localhost:3500/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!savedUserResponse.ok) {
				throw new Error("Registration failed");
			}

			const savedUser = await savedUserResponse.json();

			if (savedUser) {
				setIsLogin(true);
			}
		} catch (error) {
			setSubmitError(error.message);
		}
	};

	const handleLogin = async (data) => {
		try {
			const loggedInResponse = await fetch("http://localhost:3500/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!loggedInResponse.ok) {
				throw new Error("Login failed");
			}

			const loggedIn = await loggedInResponse.json();

			if (loggedIn) {
				dispatch(
					setLogin({
						user: loggedIn.user,
						token: loggedIn.token,
					})
				);
				navigate("/home");
			}
		} catch (error) {
			setSubmitError(error.message);
		}
	};

	const onSubmit = (data) => {
		isLogin ? handleLogin(data) : handleRegister(data);
	};

	//TODO : add default values for login and register (admin for testing)

	const {
		register,
		handleSubmit,
		reset, // clear the form ( for example after successful submit)
		control,
		formState: { errors, isValid, isDirty, isValidating, isSubmitSuccessful, isSubmitted, isLoading, isSubmitting },
	} = useForm({
		mode: "onBlur", // when to validate the form
		resolver: zodResolver(isLogin ? loginSchema : registerSchema),
	});

	// reset form when submit is successful
	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);


	console.log(errors);
	console.log("isvalidating : " + isValidating);
	console.log("isvalid : " + isValid);
	console.log("isSubmitted : " + isSubmitted);
	console.log("isSubmitSuccessful : " + isSubmitSuccessful);
	console.log("isLoading : " + isLoading);
	console.log("isSubmitting : " + isSubmitting);

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
							<Controller
								defaultValue=""
								rules={{ required: "first name is required" }}
								name="firstName"
								control={control}
								render={({ field: { name, ...field }, fieldState: { invalid, error }, formState }) => <TextField {...field} label="First Name" error={!!error} helperText={error?.message} sx={{ gridColumn: "span 2" }} />}
							/>

							<TextField {...register("lastName", { required: "lastName is required" })} label="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} sx={{ gridColumn: "span 2" }} />
							<TextField {...register("location")} label="Location" error={!!errors.location} helperText={errors.location?.message} sx={{ gridColumn: "span 4" }} />
							<TextField {...register("job")} label="Job" error={!!errors.job} helperText={errors.job?.message} sx={{ gridColumn: "span 4" }} />
							<TextField {...register("picture")} label="Picture" error={!!errors.picture} helperText={errors.picture?.message} sx={{ gridColumn: "span 4" }} />
						</>
					)}

					<TextField {...register("email")} label="Email" error={!!errors.email} helperText={errors.email?.message} sx={{ gridColumn: "span 4" }} />
					<TextField {...register("password")} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message || errors.password?.password?.message} sx={{ gridColumn: "span 4" }} />
					{!isLogin && <TextField {...register("confirmPassword")} label="Confirm Password" type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ gridColumn: "span 4" }} />}
				</Box>

				{/* BUTTONS */}
				<Box>
					<Button
						fullWidth
						disabled={isSubmitting} // disabled the button when submitting
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
					</Button>
					{submitError && <div>Error: {submitError}</div>}
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
