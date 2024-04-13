import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckEmailExistsQuery, usePasswordResetRequestMutation } from "@jsx/store/api/authApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDebounce, useMediaQuery } from "@uidotdev/usehooks";
import { passwordResetReaquestSchema } from "@validations/authSchema";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { PFormTextField } from "./Form/PFormTextField";

export function ForgetPasswordRequestForm() {
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const toast = useRef(null);

	const [
		passwordResetRequest,
		{
			error: errorPasswordResetRequest,
			isLoading: isPasswordResetRequestLoading,
			isError: isPasswordResetRequestError,
		},
	] = usePasswordResetRequestMutation();
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
		resolver: zodResolver(passwordResetReaquestSchema),
	});

	const errorMessage = isPasswordResetRequestError ? errorPasswordResetRequest : errorsForm;

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

	async function handlePasswordResetRequest(data) {
		try {
			const res = await passwordResetRequest(data).unwrap();
			if (res) {
				reset();
				toast.current.show({
					severity: "success",
					summary: "Email has been sent successfully",
					detail: "Please Check your inbox  and click in the received link to reset the password",
				});
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				summary: "Password Reset Request Failed",
				detail: error?.data?.message || "An error occurred while sending the password reset request",
			});
		}
	}

	const onSubmit = (data) => {
		handlePasswordResetRequest(data);
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
						iconEnd={showSpinner ? "pi-spin pi-spinner" : "pi-time"}
						errorMessage={errorMessage}
					/>

					<Button
						label={isPasswordResetRequestLoading ? "Sending..." : "Send"}
						className="btn-sign-in w-17rem lg:w-6"
						iconPos="right"
						size={isNonMobile ? "large" : "small"}
						loading={isSubmitting || isPasswordResetRequestLoading}
						onClick={handleSubmit}
					>
						<svg viewBox="0 0 180 60" className="sign-in border">
							<polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
							<polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
						</svg>
					</Button>

					<p>
						<Button
							link
							className="text-xs sm:text-base font-small px-0 md:px-2 underline ml-2  text-left cursor-pointer"
							onClick={() => navigate(-1)}
						>
							{"Back to Sign in"}
						</Button>
					</p>
				</div>
			</form>
		</>
	);
}
