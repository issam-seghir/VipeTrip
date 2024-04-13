import { ResetPasswordForm } from "@jsx/components/ResetPasswordForm";
// import logo from "@svg/logo.svg?url";
import { LoginLayout } from "@jsx/components/LoginLayout";

export function ResetPassword() {
	return (
		<LoginLayout formType={"reset-password"}>
			<ResetPasswordForm />
		</LoginLayout>
	);
}
