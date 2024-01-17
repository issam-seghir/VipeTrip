import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
		<Box width={size} height={size}>
			{image ? (
				<img style={{ objectFit: "cover", borderRadius: "50%" }} width={size} height={size} alt="user" src={`${import.meta.env.VITE_SERVER_URL}/assets/${image}`} />
			) : (
				<img style={{ objectFit: "cover", borderRadius: "50%" }} width={size} height={size} src="https://i.imgur.com/OirnA4S.png" alt="User" />
			)}
		</Box>
  );
};

export default UserImage;
