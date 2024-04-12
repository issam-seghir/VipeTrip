import { ForgetPasswordForm } from "@jsx/components/ForgetPasswordForm";
// import logo from "@svg/logo.svg?url";
import { useParams } from "react-router-dom";
import { LoginLayout } from "@jsx/components/LoginLayout";

export function ForgetPassword() {
	const { resetToken } = useParams();

	return (
		<LoginLayout formType={"password-reset"}>
			<ForgetPasswordForm />
		</LoginLayout>
	);
}
