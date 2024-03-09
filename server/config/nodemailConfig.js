const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    port: 587,
	service: "gmail",
    secure: false, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});



module.exports = {
	sendEmail: function (mailOptions) {
		return transporter.sendMail(mailOptions);
	},
};
