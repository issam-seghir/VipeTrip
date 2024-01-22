// multer middleware for  uploading files
// setup File storage
/*

| Key | Description | Note |
| --- | --- | --- |
| `fieldname` | Field name specified in the form |  |
| `originalname` | Name of the file on the user's computer |  |
| `encoding` | Encoding type of the file |  |
| `mimetype` | Mime type of the file |  |
| `size` | Size of the file in bytes |  |
| `destination` | The folder to which the file has been saved | `DiskStorage` |
| `filename` | The name of the file within the `destination` | `DiskStorage` |
| `path` | The full path to the uploaded file | `DiskStorage` |
| `buffer` | A `Buffer` of the entire file | `MemoryStorage` |

*/


//*   .................... Global Config ...................

const { mbToByte } = require("@utils");
const multer = require("multer");
const path = require("node:path");

const storage = multer.diskStorage({
	//! If no destination is given, the operating system's default directory for temporary files is used.
	destination: function (req, file, cb) {
		cb(null, "./public/");
	},
	//! If no filename is given, each file will be given a random name that doesn't include any file extension.
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
	},
});
const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};


const upload = multer({
	storage: storage,
	limits: { fileSize: mbToByte(3) },
	fileFilter: fileFilter,
});



//*   .................... Post  Config ...................


const fileFilterPost = (req, file, cb) => {
	// Allow all images types
	if (file.mimetype === "image/") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const uploadPost = multer({
	storage: storage,
	limits: { fileSize: mbToByte(3) },
	fileFilter: fileFilterPost,
});



module.exports = { upload, uploadPost };
