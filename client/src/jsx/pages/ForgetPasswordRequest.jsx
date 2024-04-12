import { ForgetPasswordRequestForm } from "@jsx/components/ForgetPasswordRequestForm";
// import logo from "@svg/logo.svg?url";
import { useParams } from "react-router-dom";
import { LoginLayout } from "@jsx/components/LoginLayout";

export function ForgetPasswordRequest() {

	return (
		<LoginLayout formType={"forget-password-request"}>
			<ForgetPasswordRequestForm />
		</LoginLayout>
	);
}
