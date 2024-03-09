import { ForgetPasswordForm } from "@jsx/components/ForgetPasswordForm";
import Logo from "@svg/logo.svg?react";
// import logo from "@svg/logo.svg?url";
import { useParams } from "react-router-dom";

export function ForgetPassword() {
	const { resetToken } = useParams();

	return (
		<div className="flex viewport">
			<div className="flex-center">
				<div className="surface-card px-4 py-4 w-11 shadow-2 border-round sm:w-9 md:w-8 lg:w-9  xl:w-8 ">
					<div className="flex-center mb-4">
						<Logo className={"surface-card logo"} style={{ transition: "all 2s linear" }} />
					</div>
					<div className="text-center flex-center flex-column gap-1 mb-6">
						<div className="text-900 lg:text-3xl md:text-2xl text-xl font-medium">Welcome Back</div>
						<div className="text-900 lg:text-3xl md:text-2xl text-xl font-medium">
							to <span className="text-primary text-animate">VipeTrip</span>
						</div>
					</div>
					<ForgetPasswordForm />
				</div>
			</div>
		</div>
	);
}
