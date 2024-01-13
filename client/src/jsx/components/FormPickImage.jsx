/* eslint-disable sonarjs/no-identical-expressions */
import FlexBetween from "@components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Typography, useTheme } from "@mui/material";
import { byteToMb } from "@utils/byteToMb";
import { getBase64 } from "@utils/getBase64";
import { useCallback, useState } from "react";

// ? see : https://stackblitz.com/edit/input-file-react-hook-form?file=src%2FForm.js

/* via register: */

/* <FormPickImage name="picture" errors={errors} register={formRegister} /> */
// Zod :
/*   avatar: z
    .instanceof(FileList)
    .refine((val) => val.length > 0, 'File is required'),
 */

const FILE_TYPE_MAP = {
	"image/*": "image/",
	"video/*": "video/",
	// Add more as needed...
};

export default function PickAvatar({ name, errors, register, type, multiple }) {
	const { onChange, ref } = register(name);
	const [image, setImage] = useState();
	const [file, setFile] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const { palette } = useTheme();
console.log(file);
	const onAvatarChange = useCallback(async (event) => {
		const file = event.target.files[0];
		if (file) {
			const fileTypePrefix = FILE_TYPE_MAP[type];
			if (!fileTypePrefix || !file.type.startsWith(fileTypePrefix)) {
				setErrorMessage(`Invalid file type. Please select a ${type} file.`);
				return;
			}
			const base64 = await getBase64(file);

			setErrorMessage(null); // Clear the error message
			setImage(base64);
			setFile(file);
			onChange(event);
		}
	}, []);

	return (
		<Box gridColumn="span 4" border={`1px solid ${palette.grey[400]}`} borderRadius="5px" p="1rem">
			<Box sx={{ "&:hover": { cursor: "pointer" } }} borderRadius="5px" border={`1px dashed ${palette.primary.main}`}>
				<input
					type="file"
					name={name}
					id={name}
					ref={ref}
					accept={type}
					multiple={multiple}
					onChange={onAvatarChange}
					style={{ display: "none" }} // Hide the actual file input
				/>

				<Box p="1rem" display={"block"} component="label" htmlFor={name} sx={{ "&:hover": { cursor: "pointer" } }}>
					{errors[name] || errorMessage ? (
						<Typography variant="body1" color={palette.grey[600]}>
							{errors[name]?.message || errorMessage}
						</Typography>
					) : file ? (
							<FlexBetween gap={1}>
								<Typography noWrap width={"280px"} variant="body1" color={palette.grey[700]}>
									{file.name}
								</Typography>
								<Box display={"flex"} gap={3}>
									<Typography variant="body1" color={palette.primary.main}>{`${byteToMb(file.size)} mb`}</Typography>
									<EditOutlinedIcon />
								</Box>
							</FlexBetween>
					) : (
						<Typography variant="body1" color={palette.grey[500]}>
							Drag here, or click to select Picture{" "}
						</Typography>
					)}
				</Box>
			</Box>
		</Box>
	);
}
