import { useNavigate } from "react-router-dom";
import { useIsAppleDevice } from "@jsx/utils/hooks/useIsAppleDevice";

export function SocialAuth() {
	const navigate = useNavigate();
	const serverUrl = import.meta.env.VITE_SERVER_URL;
	const isAppleDevice = useIsAppleDevice();

	return (
		<div className="flex gap-4 justify-content-center">
			<a href={`${serverUrl}/api/v1/auth/login/google`}>
				<i
					className="pi pi-google hover:text-primary"
					style={{ fontSize: "1.5rem", transition: "all .2s linear" }}
				/>
			</a>
			{isAppleDevice && (
				<a href={`${serverUrl}/api/v1/auth/login/apple`}>
					<i
						className="pi pi-apple hover:text-primary"
						style={{ fontSize: "1.5rem", transition: "all .2s linear" }}
					/>
				</a>
			)}

			<a href={`${serverUrl}/api/v1/auth/login/facebook`}>
				<i
					className="pi pi-facebook hover:text-primary"
					style={{ fontSize: "1.5rem", transition: "all .2s linear" }}
				/>
			</a>
			<a href={`${serverUrl}/api/v1/auth/login/linkedin`}>
				<i
					className="pi pi-linkedin hover:text-primary"
					style={{ fontSize: "1.5rem", transition: "all .2s linear" }}
				/>
			</a>
			<a href={`${serverUrl}/api/v1/auth/login/github`}>
				<i
					className="pi pi-github hover:text-primary"
					style={{ fontSize: "1.5rem", transition: "all .2s linear" }}
				/>
			</a>
		</div>
	);
}
