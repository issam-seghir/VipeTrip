import { useRegisterMutation } from "@jsx/store/api/authApi";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { useNavigate } from "react-router-dom";

import FormPickImage from "@components/FormPickImage";
import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { logFormData } from "@jsx/utils/logFormData";
// import { useFormHandleErrors } from "@utils/hooks/useFormHandleErrors";
import { PFormTextField } from "@components/Form/PFormTextField";
import { registerSchema } from "@validations/authSchema";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";

export default function AuthForm() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isNonMobile = useMediaQuery("(min-width:600px)");
	const toast = useRef(null);

	const [register, { error: registerError, isLoading: isRegisterLoading }] = useRegisterMutation();
	const {
		handleSubmit,
		reset,
		setValue,
		watch,
		control,
		getValues,
		register: formRegister,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onBlur",
		resolver: zodResolver(registerSchema),
	});

	useFormPersist("registerForm", {
		watch,
		setValue,
		storage: window.sessionStorage, // default window.sessionStorage
		exclude: ["picture", "password", "confirmPassword"],
	});

	const picture = watch("picture");
	console.log(picture);
	// const errorMessage = useFormHandleErrors(isRegisterError, registerError);
	// const errorMessageFormat = errorMessage && `${errorMessage?.originalStatus || errorMessage?.status} : ${errorMessage?.data?.message || errorMessage?.error}`;

	// const getServerErrorMessageForField = (fieldName) => {
	// 	switch (fieldName) {
	// 		case "email": {
	// 			return errorMessage?.status === 409 && errorMessage;
	// 		}
	// 		case "password": {
	// 			return errorMessage?.status === 400 && errorMessage;
	// 		}
	// 		default: {
	// 			return null;
	// 		}
	// 	}
	// };

	async function handleRegister(data) {
		try {
			console.log(data);
			// the file picture will be added in FormData
			const formData = new FormData();
			// Append all form data to formData
			for (const key in data) {
				if (key !== "picture") {
					// Skip picture field
					formData.append(key, data[key]);
				}
			}

			// Append file to formData
			const file = data?.picture[0];
			if (file) {
				formData.append("picture", file);
			}

			logFormData(formData);
			const res = await register(formData).unwrap();

			if (res) {
				console.log(res);
				toast.current.show({
					severity: "success",
					summary: "Successful Log in 🚀",
					detail: `Welcome ${res.user.name} 👋`,
				});
				reset();
				navigate("/home");
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
		// console.log(getValues());
		// console.log(data);
		handleRegister(data);
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
						name={"firstName"}
						label="First Name"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={"pi-spin pi-spinner"}
						// errorMessage={getServerErrorMessageForField("email")}
						errorMessage={errors}
					/>
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"lastName"}
						label="Last Name"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={"pi-spin pi-spinner"}
						// errorMessage={getServerErrorMessageForField("email")}
						errorMessage={errors}
					/>
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"location"}
						label="Location"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={"pi-spin pi-spinner"}
						// errorMessage={getServerErrorMessageForField("email")}
						errorMessage={errors}
					/>
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"job"}
						label="Job"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={"pi-spin pi-spinner"}
						// errorMessage={getServerErrorMessageForField("email")}
						errorMessage={errors}
					/>

					<FormPickImage
						name="picture"
						errors={errors}
						type={"image/*"}
						multiple={false}
						register={formRegister}
					/>
					{/* <DropZone getInputProps={getInputProps} getRootProps={getRootProps} fileRejections={fileRejections} picture={picture} state={state} /> */}
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"email"}
						label="Email"
						type="email"
						size={"lg"}
						iconStart={"pi-user"}
						iconEnd={"pi-spin pi-spinner"}
						// errorMessage={getServerErrorMessageForField("email")}
						errorMessage={errors}
					/>
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"Password"}
						label="password"
						type="password"
						size={"lg"}
						iconStart={"pi-lock"}
						toogleMask={true}
						// errorMessage={getServerErrorMessageForField("password")}
						errorMessage={errors}
					/>
					<PFormTextField
						control={control}
						defaultValue={""}
						name={"confirmPassword"}
						label="Confirm Password"
						type="password"
						size={"lg"}
						iconStart={"pi-lock"}
						toogleMask={true}
						// errorMessage={getServerErrorMessageForField("password")}
						errorMessage={errors}
					/>
				</div>
				<Button
					label={isRegisterLoading ? "Loading..." : "Sign Up"}
					className="btn-sign-in w-17rem lg:w-7"
					iconPos="right"
					size={isNonMobile ? "large" : "small"}
					loading={isSubmitting || isRegisterLoading}
				>
					<svg viewBox="0 0 180 60" className="sign-in border">
						<polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
						<polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
					</svg>
				</Button>
				<Divider align="center">
					<span>or you can sign up with </span>
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
					<Button
						link
						className="text-xs sm:text-base font-small px-0 md:px-2 underline ml-2  text-left cursor-pointer"
						onClick={() => navigate("/login")}
					>
						{"Already have an account? Login here."}
					</Button>
				</div>
			</form>
		</>
	);
}
