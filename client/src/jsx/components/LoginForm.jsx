import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@jsx/store/api/authApi";
import { setCredentials } from "@jsx/store/slices/authSlice";
import { useIsAppleDevice } from "@jsx/utils/hooks/useIsAppleDevice";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
// import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { useMediaQuery } from "@uidotdev/usehooks";
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
	// const email = watch("email");
	// const debouncedEmail = useDebounce(email, 500); // Debounce the email input by 500ms

	// const {
	// 	data: chekcEmailExistance,
	// 	isLoading: isEmailChecking,
	// 	isError: isEmailCheckError,
	// } = useCheckEmailExistsQuery(debouncedEmail, {
	// 	skip: !debouncedEmail || errorsForm.email, // Skip the query if the email is empty
	// });
	console.log(errorLogin);
	// useEffect(() => {
	// 	if (chekcEmailExistance && chekcEmailExistance.invalid) {
	// 		setError("email", {
	// 			type: "manual",
	// 			message: "User Not found",
	// 		});
	// 	} else {
	// 		clearErrors("email");
	// 	}
	// }, [chekcEmailExistance?.invalid, setError, clearErrors]);

	async function handleLogin(data) {
		try {
			const res = await login(data).unwrap();
			if (res) {
				toast.current.show({
					severity: "success",
					summary: "Successful Log in 🚀",
					detail: `Welcome ${res.user.name} 👋`,
				});
				dispatch(setCredentials({ user: res?.user, token: res?.token }));
				reset();
				navigate(from, { replace: true });
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				summary: "Login Failed 💢",
				detail: error?.data,
			});
		}
	}

	const onSubmit = (data) => {
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
						defaultValue={""}
						name={"email"}
						label="Email"
						type="email"
						size={"lg"}
						iconStart={"pi-user"}
						// iconEnd={
						// 	isEmailChecking
						// 		? "pi-spin pi-spinner"
						// 		: chekcEmailExistance?.exists
						// 		? "pi-times"
						// 		: "pi-check"
						// }
						errorMessage={errorsForm}
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
						errorMessage={errorsForm}
					/>
					<div className="flex gap-2 align-items-center justify-content-between mb-4">
						<PFormCheckBox
							control={control}
							defaultValue={true}
							name={"rememberme"}
							label="Remember me"
							errorMessage={errorsForm}
						/>
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
