/* eslint-disable unicorn/no-useless-undefined */
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



//?  ***************************** Zod Utils   **********************************  */

const z = require("zod");

/**
 * This function validates a string and ensures it is not empty.
 * @param {Object} errorMap - An optional object that maps error types to error messages.
 * @returns {Object} - Returns a Zod schema that validates strings and ensures they are not empty.
 * * Usage:
 * const schema = stringNonEmpty();
 * const result = schema.parse("Hello World"); // "Hello World" ✅
 * const result2 = schema.parse(""); // Throws an error because the string is empty 💢
 */

const stringNonEmpty = (errorMap = undefined) => {
	return z.string({ errorMap: errorMap }).min(1, { message: "cannot be empty" });
};


/**
 * This function converts a string to an array using a provided schema. If the input is already an array, it is returned as is.
 * @param {Object} schema - The Zod schema to validate the array elements.
 * @param {string} defult - An optional default value to use if the input is neither a string nor an array.
 * @returns {Object} - Returns a Zod schema that validates arrays and ensures they are not empty.
 * * Usage:
 * const schema = z.string().url();
 * const arraySchema = arrayFromString(schema); // array of url strings
 * const result = arraySchema.parse("https:/test.fr,https:/git.com"); // ["https:/test.fr","https:/git.com"] ✅
 * const result = arraySchema.parse("Hello,World"); // ["Hello", "World"] // error not an URL 💢
 * const result2 = arraySchema.parse(["Hello", "World"]); // ["Hello", "World"] // error not an URL 💢
 * const result3 = arraySchema.parse(123); // Throws an error because the input is neither a string nor an array 💢
 */


const arrayFromString = (schema, defult = "") => {
	return z.preprocess((obj) => {
		if (Array.isArray(obj)) {
			return obj;
		} else if (typeof obj === "string") {
			return obj.split(",");
		} else {
			return [defult];
		}
	}, z.array(schema).nonempty({ message: "array cannot be empty" }));
};


/**
 * @summary Function returns default object from Zod schema
 * @version 23.05.15.2
 * @link https://gist.github.com/TonyGravagno/2b744ceb99e415c4b53e8b35b309c29c
 * @author Jacob Weisenburger, Josh Andromidas, Thomas Moiluiavon, Tony Gravagno
 * @param schema z.object schema definition
 * @param options Optional object, see Example for details
 * @returns Object of type schema with defaults for all fields
 * @example
 * const schema = z.object( { ... } )
 * const default1 = defaultInstance<typeof schema>(schema)
 * const default2 = defaultInstance<typeof schema>(
 *   schema,{ // toggle from these defaults if required
 *     defaultArrayEmpty: false,
 *     defaultDateEmpty: false,
 *     defaultDateUndefined: false,
 *     defaultDateNull: false,
 * } )
 */
function defaultInstance(schema, options = {}) {
	const defaultArrayEmpty = "defaultArrayEmpty" in options ? options.defaultArrayEmpty : false;
	const defaultDateEmpty = "defaultDateEmpty" in options ? options.defaultDateEmpty : false;
	const defaultDateUndefined = "defaultDateUndefined" in options ? options.defaultDateUndefined : false;
	const defaultDateNull = "defaultDateNull" in options ? options.defaultDateNull : false;

	function run() {
		if (schema instanceof z.ZodEffects) {
			if (schema.innerType() instanceof z.ZodEffects) {
				return defaultInstance(schema.innerType(), options); // recursive ZodEffect
			}
			// return schema inner shape as a fresh zodObject
			return defaultInstance(z.ZodObject.create(schema.innerType().shape), options);
		}

		if (schema instanceof z.ZodType) {
			let the_shape = schema.shape; // eliminates 'undefined' issue
			let entries = Object.entries(the_shape);
			let temp = entries.map(([key, value]) => {
				let this_default = value instanceof z.ZodEffects ? defaultInstance(value, options) : getDefaultValue(value);
				return [key, this_default];
			});
			return Object.fromEntries(temp);
		} else {
			console.log(`Error: Unable to process this schema`);
			return null; // unknown or undefined here results in complications
		}

		function getDefaultValue(dschema) {
			console.dir(dschema);
			if (dschema instanceof z.ZodDefault) {
				if (!("_def" in dschema)) return; // error
				if (!("defaultValue" in dschema._def)) return; // error
				return dschema._def.defaultValue();
			}
			if (dschema instanceof z.ZodArray) {
				if (!("_def" in dschema)) return; // error
				if (!("type" in dschema._def)) return; // error
				// return empty array or array with one empty typed element
				return defaultArrayEmpty ? [] : [getDefaultValue(dschema._def.type)];
			}
			if (dschema instanceof z.ZodString) return "";
			if (dschema instanceof z.ZodNumber || dschema instanceof z.ZodBigInt) {
				return dschema.minValue ?? 0;
			}
			if (dschema instanceof z.ZodDate) {
				return defaultDateEmpty ? "" : defaultDateNull ? null : defaultDateUndefined ? undefined : dschema.minDate;
			}
			if (dschema instanceof z.ZodSymbol) return "";
			if (dschema instanceof z.ZodBoolean) return false;
			if (dschema instanceof z.ZodNull) return null;
			if (dschema instanceof z.ZodPipeline) {
				if (!("out" in dschema._def)) return; // error
				return getDefaultValue(dschema._def.out);
			}
			if (dschema instanceof z.ZodObject) {
				return defaultInstance(dschema, options);
			}
			if (dschema instanceof z.ZodAny && !("innerType" in dschema._def)) return; // error?
			return getDefaultValue(dschema._def.innerType);
		}
	}
	return run();
}

module.exports = {
	byteToMb,
	mbToByte,
	uuid,
	signChecker,
	stringNonEmpty,
	arrayFromString,
	defaultInstance,
};
