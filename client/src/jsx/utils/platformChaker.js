export async function isAppleDevice() {
	if (navigator.userAgentData) {
		const values = await navigator.userAgentData.getHighEntropyValues(["platform"]);
		return values.platform.toLowerCase().includes("mac") || values.platform.toLowerCase().includes("ios");
	} else if (navigator?.platform) {
		return ["MacIntel", "iPhone", "iPad", "iPod"].includes(navigator?.platform);
	} else {
		console.log("navigator.userAgentData & navigator?.platform is not supported");
		return null;
	}
}
