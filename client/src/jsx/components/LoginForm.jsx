import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckEmailExistsQuery, useLoginMutation,useGoogleLoginQuery } from "@jsx/store/api/authApi";
import { setCredentials } from "@jsx/store/slices/authSlice";
import { useIsAppleDevice } from "@jsx/utils/hooks/useIsAppleDevice";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDebounce, useMediaQuery } from "@uidotdev/usehooks";
import { loginSchema } from "@validations/authSchema";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { PFormCheckBox } from "./Form/PFormCheckBox";
import { PFormTextField } from "./Form/PFormTextField";

export function LoginForm() {
	const navigate = useNavigate();
	const location = useLocation();
	let from = location.state?.from?.pathname || "/home";

	const isNonMobile = useMediaQuery("(min-width:600px)");
	const isAppleDevice = useIsAppleDevice();

	const dispatch = useDispatch();
	const toast = useRef(null);

	const [login, { error: errorLogin, isLoading: isLoginLoading, isError: isLoginError }] = useLoginMutation();
		const {
		data: googleData,
		isError: isGoogleLoginError,
	} = useGoogleLoginQuery();
	console.log(googleData);
	const {
		handleSubmit,
		watch,
		reset,
		setError,
		clearErrors,
		control,
		formState: { errors: errorsForm, isSubmitting },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(loginSchema),
	});

	const errorMessage = isLoginError ? errorLogin : errorsForm;

	// check if use email exist when typing ...
	const email = watch("email");
	const debouncedEmail = useDebounce(errorsForm?.email ? null : email?.trim().toLowerCase(), 500); // Debounce the email input by 500ms
	const {
		data: chekcEmailExistance,
		isLoading: isChekcEmailLoading,
		isFetching: isChekcEmailFetching,
		isError: isEmailCheckError,
	} = useCheckEmailExistsQuery(debouncedEmail, {
		skip: !debouncedEmail, // Skip the query if the email is empty
	});
	const [showSpinner, setShowSpinner] = useState(false);
	useEffect(() => {
		if (isChekcEmailLoading || isChekcEmailFetching) {
			setShowSpinner(true);
			setTimeout(() => {
				setShowSpinner(false);
			}, 700);
		}
	}, [isChekcEmailLoading, isChekcEmailFetching]);

	useEffect(() => {
		if (chekcEmailExistance && chekcEmailExistance.invalid && !isEmailCheckError) {
			setError("email", {
				type: "manual",
				message: "User Not found",
			});
		} else {
			clearErrors("email");
		}
	}, [chekcEmailExistance, setError, clearErrors]);

	async function handleLogin(data) {
		try {
			const res = await login(data).unwrap();
			if (res) {
				dispatch(setCredentials({ user: res?.user, token: res?.token }));
				reset();
				navigate(from, { replace: true });
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				summary: "Login Failed 💢",
				detail: error?.data?.message || "email or password not correct",
			});
		}
	}

	const onSubmit = (data) => {
		handleLogin(data);
	};
	// In your UI code, after the user is redirected back to your site
	function handleGoogleLogin() {
		try {
			const res = await googleLogin();
			if (res) {
				dispatch(setCredentials({ user: res?.user, token: res?.token }));
				reset();
				navigate(from, { replace: true });
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				summary: "Login Failed 💢",
				detail: error?.data?.message || "email or password not correct",
			});
		}
	}
	return (
		<>
			{/* react hook form dev tool  */}
			{isDev && <DevTool control={control} placement="top-left" />}
			<Toast ref={toast} />

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-column gap-2 align-items-center">
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"email"}
						label="Email"
						type="email"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={showSpinner ? "pi-spin pi-spinner" : "pi-time"}
						errorMessage={errorMessage}
					/>
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"password"}
						label="Password"
						type="password"
						size={"lg"}
						iconStart={"pi-lock"}
						toogleMask={true}
						errorMessage={errorMessage}
					/>
					<div className="flex gap-2 align-items-center justify-content-between mb-4">
						<PFormCheckBox
							control={control}
							defaultValue={true}
							name={"rememberMe"}
							label="Remember me"
							errorMessage={errorsForm}
						/>
						<Link
							to="/forgot-password"
							className="no-underline ml-2 text-xs md:text-base text-blue-500 text-right cursor-pointer"
						>
							Forgot your password?
						</Link>
					</div>

					<Button
						label={isLoginLoading ? "Loading..." : "Sign in"}
						className="btn-sign-in w-17rem lg:w-7"
						iconPos="right"
						size={isNonMobile ? "large" : "small"}
						loading={isSubmitting || isLoginLoading}
						onClick={handleSubmit}
					>
						<svg viewBox="0 0 180 60" className="sign-in border">
							<polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
							<polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
						</svg>
					</Button>
					<Divider align="center">
						<span>or you can sign in with </span>
					</Divider>
					<div className="flex gap-4 justify-content-center">
						<a href={`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login/google`}>
							<i
								className="pi pi-google hover:text-primary  "
								style={{ fontSize: "1.5rem", transition: "all .2s linear" }}
							/>
						</a>
						<a href="">
							<i className="pi pi-facebook " style={{ fontSize: "1.5rem" }} />
						</a>
						{isAppleDevice && (
							<a href="">
								<i className="pi pi-apple " style={{ fontSize: "1.5rem" }} />
							</a>
						)}
						<a href="">
							<i className="pi pi-twitter " style={{ fontSize: "1.5rem" }} />
						</a>
						<a href="">
							<i className="pi pi-linkedin " style={{ fontSize: "1.5rem" }} />
						</a>
						<a href="">
							<i className="pi pi-github " style={{ fontSize: "1.5rem" }} />
						</a>
					</div>
					<p>
						<Button
							link
							className="text-xs sm:text-base font-small px-0 md:px-2 underline ml-2  text-left cursor-pointer"
							onClick={() => navigate("/register")}
						>
							{"Don't have an account? Sign Up here."}
						</Button>
					</p>
				</div>
			</form>
		</>
	);
}
