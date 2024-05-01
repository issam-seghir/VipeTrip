/* eslint-disable unicorn/no-useless-undefined */
import { safeRegex } from "safe-regex";



/**
 ** Converts megabytes to bytes.
 * @param {number} mb - The number of megabytes to convert.
 * @returns {number} The converted value in bytes.
 * @example
 * // returns 1048576
 * mbToByte(1);
 */
export function mbToByte(mb) {
	return mb * 1024 * 1024;
}

/**
 * * Converts size in bytes to megabytes.
 *
 * @param {number} sizeInBytes - The size in bytes.
 * @param {number} [decimalsNum=2] - The number of decimal places to keep in the result.
 * @returns {number} The size in megabytes.
 *
 * @example
 * // returns 1.00
 * byteToMb(1048576);
 *
 * @example
 * // returns 1.5
 * byteToMb(1572864, 1);
 */
export const byteToMb = (sizeInBytes, decimalsNum = 2) => {
	const result = sizeInBytes / (1024 * 1024);
	const fixedResult = result.toFixed(decimalsNum);
	return +Number.parseFloat(fixedResult).toString();
};



/**
 * Generates a UUID.
 * @returns {string} The generated UUID.
 * @example
 * // returns a UUID string
 * uuid();
 */
export function uuid() {
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
export function signChecker(percent) {
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
export function isRegexSave(...regexes) {
	const unsafeRegexes = regexes.filter((regex) => !safeRegex(regex));
	return {
		allSafe: unsafeRegexes.length === 0,
		unsafeRegexes: unsafeRegexes,
	};
}


/**
 * *Retrieves the value of a specified cookie from the document's cookie string.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The value of the cookie if found, null otherwise.
 *
 * @example
 * // Set a cookie for demonstration
 * document.cookie = "username=John Doe";
 *
 * // Get the cookie
 * const username = getCookie("username");
 * console.log(username); // "John Doe"
 *
 * // Try to get a non-existent cookie
 * const nonExistent = getCookie("nonExistent");
 * console.log(nonExistent); // null
 */
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}
