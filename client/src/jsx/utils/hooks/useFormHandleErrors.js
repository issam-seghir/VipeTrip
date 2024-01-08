import { useState, useEffect } from "react";

export const useFormHandleErrors = (isLoginError, loginError, isRegisterError, registerError) => {
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		if (isLoginError || isRegisterError) {
			setErrorMessage(isLoginError ? loginError : registerError);
			const timer = setTimeout(() => {
				setErrorMessage(null);
			}, 5000); // Error message will disappear after 5 seconds

			// Clear the timer when the component is unmounted or the error changes
			return () => clearTimeout(timer);
		}
	}, [isLoginError, loginError, isRegisterError, registerError]);

	return errorMessage;
};
