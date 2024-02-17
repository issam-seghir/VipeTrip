// @ts-check
const notifier = require("node-notifier");


function errorNotification(err, str, req) {
	const title = "Error in " + req.method + " " + req.url;

	notifier.notify({
		title: title,
		message: str,
		sound: true, // Only Notification Center or Windows Toasters
	});
}

module.exports = errorNotification;
