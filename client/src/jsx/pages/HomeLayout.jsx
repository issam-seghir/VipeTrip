import Navbar from "@components/NavBar";
import { Box, useMediaQuery } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	// const { id, picturePath, fullName } = useSelector((state) => state.store.auth.user);
	return (
		<Box>
			<Navbar />
			<Suspense fallback={<div className="text-4xl text-bluegray-700">Loading .....</div>}>
				<Outlet />
			</Suspense>
		</Box>
	);
};
