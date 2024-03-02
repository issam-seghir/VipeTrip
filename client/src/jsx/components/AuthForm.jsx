import { useLoginMutation } from "@jsx/store/api/authApi";
import { useMediaQuery, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsAppleDevice } from "@jsx/utils/hooks/useIsAppleDevice";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials } from "@jsx/store/slices/authSlice";
import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { loginSchema } from "@utils/validationSchema";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { PFormCheckBox } from "./Form/PFormCheckBox";
import { PFormTextField } from "./Form/PFormTextField";
import { Divider } from "primereact/divider";


export function AuthForm() {
	const { palette } = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const isAppleDevice = useIsAppleDevice();
	const dispatch = useDispatch();
	const toast = useRef(null);

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
	const errorMessageFormat =
		errorMessage &&
		`${errorMessage?.originalStatus || errorMessage?.status} : ${
			errorMessage?.data?.message || errorMessage?.error
		}`;

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
				toast.current.show({
					severity: "success",
					summary: "Successful Log in 🚀",
					detail: `Welcome ${res.user.name} 👋`,
				});
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
			toast.current.show({
				severity: "error",
				summary: "Something Wrong 💢",
				detail: JSON.stringify(error),
			});
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
				<div className="flex flex-column gap-2 align-items-center">
					<PFormTextField
						control={control}
						defaultValue={"admin@test.com"}
						name={"email"}
						label="Email"
						type="email"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={"pi-spin pi-spinner"}
						errorMessage={getServerErrorMessageForField("email")}
					/>
					<PFormTextField
						control={control}
						defaultValue={"admin@test.com"}
						name={"Password"}
						label="password"
						type="password"
						size={"lg"}
						iconStart={"pi-lock"}
						toogleMask={true}
						errorMessage={getServerErrorMessageForField("password")}
					/>
					<div className="flex gap-2 align-items-center justify-content-between mb-4">
						<PFormCheckBox control={control} defaultValue={true} name={"rememberme"} label="Remember me" />
						<a
							href="#"
							className=" no-underline ml-2 text-xs md:text-base text-blue-500 text-right cursor-pointer"
						>
							Forgot your password?
						</a>
					</div>

					<Button
						label={isLoginLoading ? "Loading..." : "Sign in"}
						className="btn-sign-in w-17rem lg:w-7"
						iconPos="right"
						size={isNonMobile ? "large" : "small"}
						loading={isSubmitting || isLoginLoading}
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
						<a href="">
							<i className="pi pi-google " style={{ fontSize: "1.5rem" }} />
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
