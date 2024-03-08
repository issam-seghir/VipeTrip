import AdvertWidget from "@components/AdvertWidget";
import FriendListWidget from "@components/FriendListWidget";
import MyPostWidget from "@components/MyPostWidget";
import Navbar from "@components/NavBar";
import UserWidget from "@components/UserWidget";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const HomePage = () => {
	const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
	const { id, picturePath, fullName } = useSelector((state) => state.store.auth.user);
	const toast = useRef(null);

// toast.current.show({
// 	severity: "success",
// 	summary: "Successful Log in 🚀",
// 	detail: `Welcome ${fullName} 👋`,
// });
	return (
		<Box>
			<Navbar />
			<Box width="100%" padding="2rem 6%" display={isNonMobileScreens ? "flex" : "block"} gap="0.5rem" justifyContent="space-between">
				<Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
					{/* <UserWidget userId={_id} picturePath={picturePath} /> */}
				</Box>
				<Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
					{/* <MyPostWidget picturePath={picturePath} /> */}
				</Box>
				{isNonMobileScreens && (
					<Box flexBasis="26%">
						<AdvertWidget />
						<Box m="2rem 0" />
						<FriendListWidget userId={id} />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default HomePage;
