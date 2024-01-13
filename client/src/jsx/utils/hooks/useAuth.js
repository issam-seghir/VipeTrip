import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@store/slices/authSlice";

export const useAuth = () => {
	const token = useSelector(selectCurrentToken);

	return useMemo(() => ({ token }), [token]);
};
