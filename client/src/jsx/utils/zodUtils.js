/* eslint-disable unicorn/no-useless-undefined */
//?  ***************************** Zod Utils   **********************************  */

import { z } from "zod";
// import { zu } from "zod_utilz";

/**
 * @summary Function generate error map for  Zod schema
 * An object mapping error types to error messages or functions that generate error messages.
 * @example
 * z.setErrorMap(errorMap);
 *
 */

/**
 * Creates a Zod schema for a non-empty string.
 * @param {z.ZodErrorMap} errorMap - An optional object that maps error types to error messages.
 * @returns {z.ZodString} - Returns a Zod schema that validates strings and ensures they are not empty.
 * @example
 * const schema = stringNonEmpty().length(5, 255);
 * const schemaII = stringNonEmpty(myErroMap).min(5).toLower();
 * const result = schema.parse("Hello World"); // "Hello World" ✅
 * const result2 = schema.parse(""); // Throws an error because the string is empty 💢
 */

const stringNonEmpty = (errorMap = undefined) => {
	return z.string({ errorMap: errorMap }).min(1, { message: "this field is required" });
};

// const errorMap = zu.makeErrorMap({
// 	required: "is required",
// 	invalid_string: (err) => {
// 		if (err.validation === "url") {
// 			return `(${err.data}) must be a valid URL`;
// 		} else if (err.validation === "email") {
// 			return `(${err.data}) must be a valid email`;
// 		}
// 	},
// 	invalid_type: (err) => `${err.defaultError} : ${err.data}`,
// 	invalid_enum_value: ({ data, options }) =>
// 		`${data} : is not a valid enum value. Valid options: ${options?.join(" | ")} `,
// 	too_small: (err) => `value ${err.data}  expected to be  >= ${err.minimum}`,
// 	too_big: (err) => `value ${err.data} : expected to be  <= ${err.maximum}`,
// });

/**
 * This function converts a string to an array using a provided schema. If the input is already an array, it is returned as is.
 * @param {z.ZodSchema} schema - The Zod schema to validate the array elements.
 * @param {string} defult - An optional default value to use if the input is neither a string nor an array.
 * @returns {z.ZodArray<z.ZodString>} - Returns a Zod schema that validates arrays of strings and ensures they are not empty.
 * @example
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
			return defult;
		}
	}, z.array(schema).nonempty({ message: "array cannot be empty" }));
};

/**
 * @summary Function returns default object from Zod schema
 * @link https://gist.github.com/TonyGravagno/2b744ceb99e415c4b53e8b35b309c29c
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
				let this_default =
					value instanceof z.ZodEffects ? defaultInstance(value, options) : getDefaultValue(value);
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
				return defaultDateEmpty
					? ""
					: defaultDateNull
					? null
					: defaultDateUndefined
					? undefined
					: dschema.minDate;
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

/**
 * Formats a path array into a string representation. (from zod paths)
 *
 * @param {Array} path - The path array to format.
 * @returns {string} The formatted path string.
 *
 */

function formatPath(path) {
	return path
		.map((element, index) => {
			// eslint-disable-next-line unicorn/prefer-ternary
			if (Number.isInteger(element) && index > 0 && Number.isInteger(path[index - 1])) {
				// This is an array index, format it as such
				return `[${element}]`;
			} else {
				// This is not an array index, just convert it to a string
				return element.toString();
			}
		})
		.join(".");
}

const ObjectIdSchema = z.string().regex(/^[\da-f]{24}$/);

export { arrayFromString, defaultInstance, formatPath, ObjectIdSchema, stringNonEmpty };
