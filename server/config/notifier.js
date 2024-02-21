// @ts-check
const notifier = require("node-notifier");

function errorNotification(err, req) {
	const title = "Error in " + req.method + " " + req.url + " " + err.status;

	notifier.notify({
		title: title,
		message: err.message.toString(),
		sound: true, // Only Notification Center or Windows Toasters
	});
}

module.exports = errorNotification;
