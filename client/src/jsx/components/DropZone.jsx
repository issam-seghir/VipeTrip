import FlexBetween from "@components/FlexBetween";
import { byteToMb } from "@utils/byteToMb";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useState, useMemo } from "react";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";

const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#eeeeee",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
};

const focusedStyle = {
	borderColor: "#2196f3",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};


export default function DropZone({ getInputProps, getRootProps, fileRejections, state, picture }) {
	const { palette } = useTheme();

	const style = useMemo(
		() => ({
			...baseStyle,
			...(state?.isFocused ? focusedStyle : {}),
			...(state?.isDragAccept ? acceptStyle : {}),
			...(state?.isDragReject ? rejectStyle : {}),
		}),
		[state?.isFocused, state?.isDragAccept, state?.isDragReject]
	);

	return (
		<Box gridColumn="span 4" border={`1px solid ${palette.grey[400]}`} borderRadius="5px" p="1rem">
			<Box {...getRootProps({ style })} p="1rem" sx={{ "&:hover": { cursor: "pointer" } }}>
				<input {...getInputProps()} />

				{picture ? (
					<FlexBetween gap={1}>
						<Typography noWrap width={"280px"} variant="body1" color={palette.grey[700]}>
							{picture?.name}
						</Typography>
						<Typography variant="body1" color={palette.primary.main}>{`${byteToMb(picture?.size)} mb`}</Typography>
						<EditOutlinedIcon />
					</FlexBetween>
				) : (
					<Typography variant="body1" color={palette.grey[500]}>
						Drag here, or click to select Picture{" "}
					</Typography>
				)}
				{state?.isDragReject && (
					<Typography variant="body1" color={palette.grey[500]}>
						{fileRejections[0]?.errors?.code} {fileRejections[0]?.errors?.message}
					</Typography>
				)}
			</Box>
		</Box>
	);
}
