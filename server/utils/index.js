/* eslint-disable unicorn/no-useless-undefined */

/**
 * Converts bytes to megabytes.
 * @param {number} byte - The number of bytes to convert.
 * @returns {number} The converted value in megabytes.
 * @example
 * // returns "1.00"
 * byteToMb(1048576);
 */
function byteToMb(byte) {
	return (byte / 1024 / 1024).toFixed(2);
}

/**
 * Converts megabytes to bytes.
 * @param {number} mb - The number of megabytes to convert.
 * @returns {number} The converted value in bytes.
 * @example
 * // returns 1048576
 * mbToByte(1);
 */
function mbToByte(mb) {
	return mb * 1024 * 1024;
}


/**
 * Generates a UUID.
 * @returns {string} The generated UUID.
 * @example
 * // returns a UUID string
 * uuid();
 */
function uuid() {
	return crypto.randomUUID();
}

/**
 * Checks if a percentage is positive.
 * @param {string} percent - The percentage to check.
 * @returns {boolean} True if the percentage is positive, false otherwise.
 * @example
 * // returns true
 * signChecker("10%");
 */
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
