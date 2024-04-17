/* eslint-disable unicorn/no-useless-undefined */

/**
 * Converts bytes to megabytes.
 * @param {number} byte - The number of bytes to convert.
 * @returns {number} The converted value in megabytes.
 * @example
 * // returns "1.00"
 * byteToMb(1048576);
 */
import safeRegex from "safe-regex";

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
/**
 * Checks if multiple regular expressions are safe.
 *
 * @param {...RegExp} regexes - The regular expressions to check.
 * @returns {{allSafe: boolean, unsafeRegexes: RegExp[]}} - Returns an object with a boolean property 'allSafe' indicating if all regular expressions are safe, and an 'unsafeRegexes' property containing an array of unsafe regular expressions. If all are safe, 'unsafeRegexes' will be an empty array.
 *
 * @example
 * const durationRegex = /^(\d+(\.\d+)?(ms|s|m|h|d|w|y))$/;
 * const hexRegex = /[\da-f]{128}$/i;
 *
 * const result = isRegexSave(durationRegex, hexRegex, mongodbUriRegex);
 * if (!result.allSafe) {
 * 	result.unsafeRegexes.forEach((regex) => {
 * 		log.error("Unsafe regex:", regex);
 * 	});
 * 	throw createError(500, "One or more regular expressions are not safe.");
 * }
 */
function isRegexSave(...regexes) {
	const unsafeRegexes = regexes.filter((regex) => !safeRegex(regex));
	return {
		allSafe: unsafeRegexes.length === 0,
		unsafeRegexes: unsafeRegexes,
	};
}


export default {
	byteToMb,
	mbToByte,
	uuid,
	signChecker,
	isRegexSave,
};
export function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
}
