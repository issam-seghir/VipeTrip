
const axios = require("axios");
const sha1 = require("sha1");


/*
Check if a password has been compromised:
You can use the Have I Been Pwned API to check if a password has been compromised.

* usage :
const isCompromised = await isPasswordCompromised(password);
if (isCompromised) {
	return next(createError.BadRequest("This password has been compromised."));
}
*/
async function isPasswordCompromised(password) {
	const hash = sha1(password).toUpperCase();
	const prefix = hash.slice(0, 5);
	const suffix = hash.slice(5);

	const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
	const hashes = response.data.split("\r\n");

	for (let hash of hashes) {
		const [hashSuffix, count] = hash.split(":");
		if (hashSuffix === suffix) {
			return true;
		}
	}

	return false;
}

/*
Check if an email is a temporary email:
There are several services that provide APIs to check if an email is a temporary email,
such as Block Temp Email, Email Checker, etc.
Here's an example of how you could use the Block Temp Email API:

* usage :
const isTemporary = await isTemporaryEmail(email);
if (isTemporary) {
    return next(createError.BadRequest("Temporary emails are not allowed."));
}
*/

async function isTemporaryEmail(email) {
    const response = await axios.get(`https://block-temp-email.vercel.app/api/${email}`);
    return response.data.blocked;
}


module.exports = { isPasswordCompromised, isTemporaryEmail };
