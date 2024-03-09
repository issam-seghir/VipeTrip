const nodemailer = require("nodemailer");
const { ENV } = require("@/validations/envSchema");
const mg = require("nodemailer-mailgun-transport");

// with mailgun
// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
	auth: {
		api_key: ENV.MAILGUN_API_KEY,
		domain: ENV.MAILGUN_DOMIAN_NAME,
	},
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));


// with gmail
const transporter = nodemailer.createTransport({
	// host: "smtp.ethereal.email",
	port: 587,
	service: "gmail",
	secure: false, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: ENV.EMAIL_USERNAME,
		pass: ENV.EMAIL_PASSWORD,
	},
});

module.exports = {
	sendEmail: function (mailOptions) {
		return transporter.sendMail(mailOptions);
	},
	sendEmailMailgun: function (mailOptions) {
		return nodemailerMailgun.sendMail(mailOptions);
	},
};
