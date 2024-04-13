import { isDev } from "@data/constants";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePasswordResetMutation } from "@jsx/store/api/authApi";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useDebounce, useMediaQuery } from "@uidotdev/usehooks";
import { passwordResetReaquestSchema } from "@validations/authSchema";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { PFormTextField } from "./Form/PFormTextField";

export function ResetPasswordForm() {
	const navigate = useNavigate();
	const [queryParams, setQueryParams] = useSearchParams();
	const resetToken = queryParams.get("token");
	const userId = queryParams.get("id");
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const toast = useRef(null);

	const [
		passwordReset,
		{ error: errorPasswordReset, isLoading: isPasswordResetLoading, isError: isPasswordResetError },
	] = usePasswordResetMutation();
	const {
		handleSubmit,
		reset,
		setError,
		clearErrors,
		control,
		formState: { errors: errorsForm, isSubmitting },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(passwordResetReaquestSchema),
	});

	const errorMessage = isPasswordResetError ? errorPasswordReset : errorsForm;

	async function handlePasswordReset(data) {
		try {
			const res = await passwordReset(data).unwrap();
			if (res) {
				reset();
				toast.current.show({
					severity: "success",
					summary: "All done !!",
					detail: "Your Password has been reset successfully, you can now login with your new password.",
				});
			}
		} catch (error) {
			console.error(error);
			toast.current.show({
				severity: "error",
				summary: "Password Reset Failed",
				detail: error?.data?.message || "An error occurred while resetting your password",
			});
		}
	}

	const onSubmit = (data) => {
		handlePasswordReset({ ...data, userId, resetToken });
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
						name={"password"}
						label="Password"
						type="password"
						size={"lg"}
						iconStart={"pi-lock"}
						toogleMask={true}
						errorMessage={errorMessage}
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
						errorMessage={errorsForm}
					/>

					<Button
						label={isPasswordResetLoading ? "Reseting..." : "Reset"}
						className="btn-sign-in w-17rem lg:w-6"
						iconPos="right"
						size={isNonMobile ? "large" : "small"}
						loading={isSubmitting || isPasswordResetLoading}
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
							onClick={() => navigate("..")}
						>
							{"Back to Sign in"}
						</Button>
					</p>
				</div>
			</form>
		</>
	);
}
