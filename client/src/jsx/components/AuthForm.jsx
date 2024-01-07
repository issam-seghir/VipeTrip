import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useApiLoginMutation, useApiRegisterMutation } from "@store/api/authApi";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormTextField from "@components/FormTextField";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { mbToByte } from "@jsx/utils/mbToByte";
import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { loginSchema, registerSchema } from "@utils/validationSchema";
import {useDropzone} from "react-dropzone";

import DropZone from "@components/DropZone";

export default function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);

	const { palette } = useTheme();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");

	const [apiLogin, { data: loginData, error: loginError, isLoading: isLoginLoading, isSuccess: isLoginSuccess, isError: isLoginError }] = useApiLoginMutation();
	const [apiRegister, { data: registerData, error: registerError, isLoading: isRegisterLoading, isSuccess: isRegisterSuccess, isError: isRegisterError }] = useApiRegisterMutation();
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

	const errorMessage = useFormHandleErrors(isLoginError, loginError, isRegisterError, registerError);

	// console.log("login message " + JSON.stringify(loginError?.data));
	// console.log("register message " + JSON.stringify(registerError?.data));
	// console.log("login data " + loginData);
	// console.log("register data " + registerData);
	// console.log(errors);

	const handleDropZone = (acceptedFiles) => {
		// add new value (picture) to form
		setValue("picture", acceptedFiles[0]);
	};
	const { getRootProps, getInputProps, fileRejections, ...state } = useDropzone({ accept: { "image/*": [] }, maxSize: mbToByte(2), maxFiles: 1, multiple: false, onDrop: handleDropZone });
	const picture = watch("picture");


	const onSubmit = (data) => {
		isLogin ? apiLogin(data) : apiRegister(data);
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
					<FormTextField defaultValue={"admin@test.com"} name={"email"} label="Email" control={control} sx={{ gridColumn: "span 4" }} />
					<FormTextField defaultValue={"123456@Admin"} name={"password"} label="Password" type="password" control={control} sx={{ gridColumn: "span 4" }} />
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
						{errorMessage && <div>{errorMessage}</div>}
					</Typography>
				</Box>
			</form>
		</>
	);
}
