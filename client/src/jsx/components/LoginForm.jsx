import { useLoginMutation } from "@jsx/store/api/authApi";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormTextField from "@components/FormTextField";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials } from "@jsx/store/slices/authSlice";
import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { loginSchema } from "@utils/validationSchema";
import { useDispatch } from "react-redux";

export default function AuthForm() {
	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const [login, { error: loginError, isLoading: isLoginLoading, isError: isLoginError }] = useLoginMutation();
	const {
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm({
		mode: "onBlur", // when to validate the form
		resolver: zodResolver(loginSchema),
	});

	const errorMessage = useFormHandleErrors(isLoginError, loginError);
	const errorMessageFormat = errorMessage && `${errorMessage?.originalStatus || errorMessage?.status} : ${errorMessage?.data?.message || errorMessage?.error}`;

	const getServerErrorMessageForField = (fieldName) => {
		switch (fieldName) {
			case "email": {
				return errorMessage?.status === 404 && errorMessage;
			}
			case "password": {
				return errorMessage?.status === 401 && errorMessage;
			}
			default: {
				return null;
			}
		}
	};

	async function handleLogin(data) {
		try {
			const res = await login(data).unwrap();

			if (res) {
				console.log(res);
				dispatch(setCredentials({ user: res?.user, token: res?.token }));
				// reset form when submit is successful (keep default values)
				reset();
				// redirect to home page after successful login
				navigate("/home");
			}
		} catch (error) {
			console.error(error);
		}
	}

	const onSubmit = (data) => {
		console.log(data);
		handleLogin(data);
	};

	return (
		<>
			{/* react hook form dev tool  */}
			{import.meta.env.DEV && <DevTool control={control} placement="top-left" />}
			{/* login */}
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
					sx={{
						"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
					}}
				>
					<FormTextField defaultValue={"admin@test.com"} name={"email"} label="Email" control={control} errorMessage={getServerErrorMessageForField("email")} sx={{ gridColumn: "span 4" }} />
					<FormTextField defaultValue={"123456@Admin"} name={"password"} label="Password" type="password" errorMessage={getServerErrorMessageForField("password")} control={control} sx={{ gridColumn: "span 4" }} />
				</Box>

				{/* BUTTONS */}
				<Box>
					{/* Submit button */}
					<Button
						fullWidth
						disabled={isSubmitting || isLoginLoading} // disabled the button when submitting
						type="submit"
						sx={{
							m: "2rem 0",
							p: "1rem",
							backgroundColor: palette.primary.main,
							color: palette.background.alt,
							"&:hover": { color: palette.primary.main },
						}}
					>
						{isLoginLoading ? "Loading..." : "LOGIN"}
					</Button>
					{/* Switch between login and register form */}
					<Typography
						onClick={() => navigate("/register")}
						sx={{
							textDecoration: "underline",
							color: palette.primary.main,
							"&:hover": {
								cursor: "pointer",
								color: palette.primary.light,
							},
						}}
					>
						{"Don't have an account? Sign Up here."}
					</Typography>
					{/* error message */}
					<Typography align="center" variant="h3" sx={{ color: palette.error.main, mt: 5 }}>
						<div>{errorMessageFormat}</div>
					</Typography>
				</Box>
			</form>
		</>
	);
}
