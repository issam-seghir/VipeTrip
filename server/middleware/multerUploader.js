// multer middleware for  uploading files
// setup File storage
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/");
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

const upload = multer({ storage: storage });

module.exports = { upload };
