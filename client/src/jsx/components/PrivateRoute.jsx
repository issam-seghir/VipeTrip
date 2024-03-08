import { useAuth } from "@utils/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateOutlet() {
	const auth = useAuth();
	const location = useLocation();
	console.log(auth);
	// state={{ from: location }}  : used to redirect the user back to the page they were trying to access after they log in
	// replace : when the user clicks the browser's back button, they won't go back to the private route they were redirected from, but to whatever page was there before it.
	return auth.token ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
}
