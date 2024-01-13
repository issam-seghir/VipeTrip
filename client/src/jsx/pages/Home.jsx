import React from 'react'
import NavBar from "@components/NavBar";
import { useSelector } from "react-redux";
import { useLazyGetUserByIDQuery } from "@store/api/userApi";

export default function Home() {
	const userId = useSelector((state) => state.auth.user._id);
	console.log(userId);
	const [trigger, { data, error, isLoading }] = useLazyGetUserByIDQuery();
	const testJWT = () => {
		trigger(userId);
		console.log(data);
	}

  if (isLoading) {
		return <div>Loading...</div>;
  }

  if (error) {
		return <div>Error: {error.message}</div>;
  }
  return (
		<div>
			<NavBar />
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
