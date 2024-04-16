import { useLogoutMutation } from "@store/api/authApi";
import { selectCurrentToken } from "@store/slices/authSlice";
import { useSelector } from "react-redux";
import { getCookie } from "@utils/index";

export const useAuth = () => {
	const localToken = useSelector(selectCurrentToken);
	const socialToken = getCookie("socialToken");
	const token = localToken || socialToken;
	const [logout, { isLoading: isLoggingOut, error }] = useLogoutMutation();

	const handleLogout = async () => {
		try {
			await logout().unwrap();
			// Handle successful logout (e.g., redirect to login page)
		} catch (error) {
			// Handle failed logout
			console.error(error);
		}
	};

	return { token, logout: handleLogout, isLoggingOut };
};
