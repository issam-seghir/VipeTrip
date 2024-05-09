/* eslint-disable unicorn/no-useless-undefined */
import uFuzzy from "@leeoniya/ufuzzy";
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

/**
 * Debounces a function, delaying its execution until after a specified delay.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The amount of time to delay in milliseconds.
 * @returns {Function} The debounced function.
 * @example
 * const debouncedFunc = debounce(() => console.log('Hello'), 500);
 * debouncedFunc(); // 'Hello' will be logged to the console after 500ms.
 */
export function debounce(func, delay) {
	let debounceTimer;
	return function () {
		const args = arguments;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(this, args), delay);
	};
}

/**
 * Performs a fuzzy search on an array of data.
 * @param {string} query - The search query.
 * @param {Array} data - The data to search through.
 * @returns {Array} The search results.
 * @example
 * const data = ['apple', 'banana', 'cherry'];
 * const results = fuzzySearch('ap', data); // ['apple']
 */
export function fuzzySearch(query, data) {
	const uf = new uFuzzy();
	const idxs = uf.filter(data, query);
	if (idxs && idxs.length > 0) {
		const info = uf.info(idxs, data, query);
		const order = uf.sort(info, data, query);
		return order.map((i) => data[info.idx[i]]);
	}
	return [];
}

/**
 * Converts a JavaScript object into a FormData instance.
 *
 * @param {Object|Array|Date|File|number|string} val - The value to be converted.
 * @param {FormData} [formData=new FormData()] - The FormData instance to append to.
 * @param {string} [namespace=""] - The namespace for the key in the FormData instance.
 * @returns {FormData} The FormData instance with the appended key-value pairs.
 *
 * @example
 * // Convert an object with primitive values
 * const obj = { name: 'John', age: 30 };
 * const formData = convertModelToFormData(obj);
 *
 * @example
 * // Convert an object with an array
 * const obj = { name: 'John', hobbies: ['reading', 'gaming'] };
 * const formData = convertModelToFormData(obj);
 *
 * @example
 * // Convert an object with a File instance
 * const obj = { name: 'John', profilePic: new File([''], 'filename') };
 * const formData = convertModelToFormData(obj);
 *
 * @example
 * // Convert an object with a nested object
 * const obj = { name: 'John', address: { city: 'New York', country: 'USA' } };
 * const formData = convertModelToFormData(obj);
 */

export function convertModelToFormData(val, formData = new FormData(), namespace = "") {
	if (val !== undefined && val !== null) {
		if (val instanceof Date) {
			formData.append(namespace, val.toISOString());
		} else if (Array.isArray(val)) {
			val.forEach((element, i) => {
				if (element instanceof File) {
					formData.append(`${namespace}`, element);
				} else {
					convertModelToFormData(element, formData, `${namespace}[${i}]`);
				}
			});
		} else if (typeof val === "object" && !(val instanceof File)) {
			Object.keys(val).forEach((propertyName) => {
				convertModelToFormData(
					val[propertyName],
					formData,
					namespace ? `${namespace}[${propertyName}]` : propertyName
				);
			});
		} else if (val instanceof File) {
			formData.append(namespace, val);
		} else {
			formData.append(namespace, val.toString());
		}
	}
	return formData;
}

/**
 * Capitalizes the first character of each word of a  string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The capitalized string.
 * @example
 * toTitleCase('hello world'); // 'Hello World'
 */
export function toTitleCase(string) {
	return string
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Generates a random number between two given numbers.
 *
 * @param {number} min - The minimum number.
 * @param {number} max - The maximum number.
 * @returns {number} A random number between min and max.
 *
 * @example
 * // Returns a number between 1 and 10
 * randomNumberBetween(1, 10);
 *
 * @example
 * // Returns a number between 100 and 200
 * randomNumberBetween(100, 200);
 */
export const randomNumberBetween = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Waits for the specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} - A promise that resolves after the specified time.
 * @example
 * // Wait for 1 second (1000 milliseconds)
 * await wait(1000);
 *
 * // Wait for 500 milliseconds
 * wait(500).then(() => {
 *   console.log('Waited for 500 milliseconds');
 * });
 */
export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
