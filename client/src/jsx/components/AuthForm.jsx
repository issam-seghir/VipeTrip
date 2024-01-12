import { useLoginMutation, useRegisterMutation } from "@jsx/store/api/authApi";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { useNavigate } from "react-router-dom";

import DropZone from "@components/DropZone";
import FormTextField from "@components/FormTextField";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials } from "@jsx/store/slices/authSlice";
import { logFormData } from "@jsx/utils/logFormData";
import { mbToByte } from "@jsx/utils/mbToByte";
import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { loginSchema, registerSchema } from "@utils/validationSchema";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { useConditionalFormPersist } from "@jsx/utils/hooks/useFormPersistConditional";

export default function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);

	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const [login, { error: loginError, isLoading: isLoginLoading, isError: isLoginError }] = useLoginMutation();
	const [register, { error: registerError, isLoading: isRegisterLoading, isError: isRegisterError }] = useRegisterMutation();
	const {
		handleSubmit,
		reset,
		setValue,
		watch,
		control,
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm({
		mode: "onBlur", // when to validate the form
		resolver: zodResolver(isLogin ? loginSchema : registerSchema),
	});
	// useConditionalFormPersist(isLogin, window.sessionStorage, watch, setValue, ["picture", "password"]);
    const persistHook = useFormPersist("registerForm", {
		watch,
		setValue,
		storage: window.sessionStorage, // default window.sessionStorage
		exclude: ["picture", "password"],
	});
	const persistHookII = null;
	isLogin ? persistHook : persistHookII;

	const picture = watch("picture");
	const errorMessage = useFormHandleErrors(isLoginError, loginError, isRegisterError, registerError);
	const errorMessageFormat = errorMessage && `${errorMessage?.originalStatus || errorMessage?.status} : ${errorMessage?.data || errorMessage?.data?.message || errorMessage?.error}`;
	const handleDropZone = (acceptedFiles) => {
		// add new value (picture) to form
		setValue("picture", acceptedFiles[0]);
	};
	const { getRootProps, getInputProps, fileRejections, ...state } = useDropzone({ accept: { "image/*": [] }, maxSize: mbToByte(2), maxFiles: 1, multiple: false, onDrop: handleDropZone });

	const getServerErrorMessageForField = (fieldName) => {
		switch (fieldName) {
			case "email": {
				return (errorMessage?.originalStatus === 404 || errorMessage?.status === 409) && errorMessage;
			}
			case "password": {
				return (errorMessage?.originalStatus === 401 || errorMessage?.originalStatus === 400) && errorMessage;
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
	async function handleRegister(data) {
		try {
			console.log(data);
			// the file picture will be added in FormData
			const formData = new FormData();
			Object.keys(data).forEach((key) => formData.append(key, data[key]));
			// add a new field content the Picture Path to save it in the db
			formData.append("picturePath", data?.picture?.name || "");
			logFormData(formData);
			const res = await register(data).unwrap();

			if (res) {
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
		isLogin ? handleLogin(data) : handleRegister(data);
	};
	const handleFormSwitch = () => {
		setIsLogin((prev) => {
			// Reset the form fields when switching between login and register form
			reset({
				email: prev ? "" : "admin@test.com",
				password: prev ? "" : "123456@Admin",
			});
			return !prev;
		});
	};

	return (
		<>
			{/* react hook form dev tool  */}
			{import.meta.env.DEV && <DevTool control={control} placement="top-left" />}
			{/* login / register FORM */}
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
							<DropZone getInputProps={getInputProps} getRootProps={getRootProps} fileRejections={fileRejections} picture={picture} state={state} />
						</>
					)}
					<FormTextField defaultValue={"admin@test.com"} name={"email"} label="Email" control={control} errorMessage={getServerErrorMessageForField("email")} sx={{ gridColumn: "span 4" }} />
					<FormTextField defaultValue={"123456@Admin"} name={"password"} label="Password" type="password" errorMessage={getServerErrorMessageForField("password")} control={control} sx={{ gridColumn: "span 4" }} />
					{!isLogin && <FormTextField defaultValue="" name={"confirmPassword"} label="Confirm Password" type="password" control={control} sx={{ gridColumn: "span 4" }} />}
				</Box>

				{/* BUTTONS */}
				<Box>
					{/* Submit button */}
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
					{/* Switch between login and register form */}
					<Typography
						onClick={handleFormSwitch}
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
						<div>{errorMessageFormat}</div>
					</Typography>
				</Box>
			</form>
		</>
	);
}
