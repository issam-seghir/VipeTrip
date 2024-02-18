// @ts-check
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

const { mbToByte } = require("@/utils");
const { fileFilter, fileFilterPost } = require("@/utils/multerUtils");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_POST_MB = 5;
const GLOBAL_DIR = "./public/global";
const POSTS_DIR = "./public/posts";

// Function to generate a unique filename
const getUniqueFilename = (file) => {
	const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
	return `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
};

//? -------- Storage Config -------------

const storage = multer.diskStorage({
	//* If no destination is given, the operating system's default directory for temporary files is used.
	destination: function (req, file, cb) {
		const dir = path.join(__dirname, GLOBAL_DIR);
		// Create directory if it doesn't exist
		fs.mkdirSync(dir, { recursive: true });

		cb(null, dir);
	},
	//* If no filename is given, each file will be given a random name that doesn't include any file extension.
	filename: function (req, file, cb) {
		cb(null, getUniqueFilename(file));
	},
});

const storagePost = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, POSTS_DIR);
	},
	filename: function (req, file, cb) {
		cb(null, getUniqueFilename(file));
	},
});

//? --------- uploader middleware config ----------

const upload = multer({
	storage: storage,
	limits: { fileSize: mbToByte(MAX_FILE_SIZE_MB) },
	fileFilter: fileFilter,
});

const uploadPost = multer({
	storage: storagePost,
	limits: { fileSize: mbToByte(MAX_FILE_SIZE_POST_MB) },
	fileFilter: fileFilterPost,
});

module.exports = { upload, uploadPost };
