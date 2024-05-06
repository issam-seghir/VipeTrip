import { Icon } from "@iconify/react";

import { selectCurrentUser } from "@store/slices/authSlice";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function CreatePostWidget({ onClick }) {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);

	return (
		<div
			className="cursor-pointer flex flex-column justify-content-between gap-3 p-3 w-full border-1 surface-border border-round"
			onClick={onClick}
			onKeyDown={() => {}}
			tabIndex={0}
			role="button"
		>
			<div className="flex justify-content-between gap-2">
				<Avatar
					size="large"
					onClick={() => navigate(`/profile/${user?.id}`)}
					image={user?.picturePath}
					alt={user?.fullName}
					shape="circle"
				/>
				<div className="pl-6 p-2 flex-1 text-left border-1 surface-border border-round-3xl">
					What&apos;s on your mind?
				</div>
			</div>
			<div className="flex gap-2">
				<Button label="Media" icon="pi pi-image" iconPos="left" className="p-button-text" />
				<Button
					label="Emoji"
					icon={<Icon icon="uil:smile" className="pi p-button-icon-left" />}
					iconPos="left"
					className="p-button-text"
				/>
				<Button label="Poll" icon="pi pi-chart-bar" iconPos="left" className="p-button-text" />
			</div>
		</div>
	);
}
