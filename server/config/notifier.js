// @ts-check
const notifier = require("node-notifier");

/**
 * Sends a notification with details about an HTTP error.
 *
 * @param {Error} err - An Error object that contains information about the error that occurred.
 * @param {string} str - A string that provides additional information about the error. This will be used as the message in the notification.
 * @param {Request} req - An Express Request object that represents the HTTP request during which the error occurred. The method and URL of the request will be included in the notification title.
 *
 * @example
 * // An example of how to use errorNotification
 * app.use((err, req, res, next) => {
 *   errorNotification(err, err.message, req);
 *   next(err);
 * });
 */

function errorNotification(err, str, req) {
	const title = "Error in " + req.method + " " + req.url;

	notifier.notify({
		title: title,
		message: str,
		sound: true, // Only Notification Center or Windows Toasters
	});
}

module.exports = errorNotification;
