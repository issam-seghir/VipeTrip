import { isAppleDevice } from "@jsx/utils/platformChaker";

import { useEffect, useState } from "react";

export function useIsAppleDevice() {
	const [isApple, setIsApple] = useState(false);

	useEffect(() => {
		const checkDevice = async () => {
			try {
				const appleDevice = await isAppleDevice();
				if (appleDevice) {
					console.info("It's an apple device ✔, you will be able to use apple sign in.");
				}
				else{
					console.info("It's not an apple device ❌, you will not be able to use apple sign in.");
				}
				setIsApple(appleDevice);
			} catch (error) {
				console.log("Error checking if it's apple device");
				console.log(error);
			}

		};

		checkDevice();
	}, []);

	return isApple;
}
