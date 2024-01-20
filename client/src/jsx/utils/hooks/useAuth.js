import { useSelector } from "react-redux";
import { useLogoutMutation } from "@store/api/authApi";
import { selectCurrentToken } from "@store/slices/authSlice";

export const useAuth = () => {
	const token = useSelector(selectCurrentToken);
	const [logout, { isLoading: isLoggingOut ,error}] = useLogoutMutation();

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
