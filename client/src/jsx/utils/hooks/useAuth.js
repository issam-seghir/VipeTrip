import { useSelector } from "react-redux";
import { useLogoutMutation } from "@store/api/authApi";
import { selectCurrentToken } from "@store/slices/authSlice";
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
}

export const useAuth = () => {
	const localToken = useSelector(selectCurrentToken);
	const socialToken = getCookie("socialToken");
	const token = localToken || socialToken;
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
