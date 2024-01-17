import { useLazyGetUserByIdQuery } from "@store/api/userApi";
import { useSelector } from "react-redux";

export default function TestJWT() {
	const [trigger, { data, error, isLoading }] = useLazyGetUserByIdQuery();
	const userId = useSelector((state) => state.auth.user._id);

	const testJWT = () => {
		trigger(userId);
		console.log(data);
	};
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error?.message}</div>;
	}
	return (
		<div>
			{data && (
				<div>
					<h1>{data.name}</h1>
					<p>{data.email}</p>
				</div>
			)}
			<button onClick={testJWT}>Test JWT</button>
		</div>
	);
}
