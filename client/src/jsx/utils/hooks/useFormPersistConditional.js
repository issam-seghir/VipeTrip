import { useEffect } from "react";
import useFormPersist from "react-hook-form-persist";

// Custom hook that wraps useFormPersist
export const useConditionalFormPersist = (isLogin,storage, watch, setValue,exclude) => {
	useEffect(() => {
		if (!isLogin) {
			useFormPersist("registerForm", {
				watch,
				setValue,
				storage: storage, // default window.sessionStorage
				exclude: exclude,
			});
		}
	}, [isLogin, watch, setValue]);
};

