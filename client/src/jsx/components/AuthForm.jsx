import { useLoginMutation } from "@jsx/store/api/authApi";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useRef } from "react";

import FormTextField from "@components/FormTextField";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials } from "@jsx/store/slices/authSlice";
import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { loginSchema } from "@utils/validationSchema";
import { useDispatch } from "react-redux";
import { isDev } from "@data/constants";
import { Toast } from "primereact/toast";
import { PFormTextField } from "./Form/PFormTextField";
import { PFromPasswordField } from "./Form/PFromPasswordField";

export  function AuthForm() {
	const { palette } = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const dispatch = useDispatch();
	const toast = useRef(null);

	const show = (res) => {
		toast.current.show({ severity: "success", summary: "Successful Log in 🚀", detail: `Welcome ${res.user.name} 👋` });
	};

	const navigate = useNavigate();
	const location = useLocation();
	let from = location.state?.from?.pathname || "/home";

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
				show(res);
				dispatch(setCredentials({ user: res?.user, token: res?.token }));
				// reset form when submit is successful (keep default values)
				reset();
				// Send them back to the page they tried to visit when they were
				// redirected to the login page. Use { replace: true } so we don't create
				// another entry in the history stack for the login page.  This means that
				// when they get to the protected page and click the back button, they
				// won't end up back on the login page, which is also really nice for the
				// user experience.
				navigate(from, { replace: true });
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
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-column gap-2">
					<PFormTextField control={control} defaultValue={"admin@test.com"} name={"email"} label="Email" type="email" size={"lg"} iconStart={"pi-user"} iconEnd={"pi-spin pi-spinner"} errorMessage={getServerErrorMessageForField("email")} />
					<PFromPasswordField control={control} defaultValue={"123456@Admin"} name={"password"} label="Password" type="password" size={"lg"} iconStart={"pi-lock"} iconEnd={"pi-spin pi-spinner"} errorMessage={getServerErrorMessageForField("password")} />
				</div>

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
