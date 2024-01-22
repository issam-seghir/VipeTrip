function byteToMb(byte) {
	return (byte / 1024 / 1024).toFixed(2);
}

function mbToByte(mb) {
	return mb * 1024 * 1024;
}

function uuid() {
	return crypto.randomUUID();
}

function signChecker(percent) {
	const numericPercent = Number.parseFloat(percent); // Convert string percentage to a number
	return numericPercent > 0;
}


module.exports = {
    byteToMb,
    mbToByte,
    uuid,
    signChecker,
};
