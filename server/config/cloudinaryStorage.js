/*
See :
1. https://github.com/xhumaliosmani/cloudinary-upload-image-tutorial/blob/main/controller/routeUpload.js
2. https://www.youtube.com/watch?v=3Gj_mL9JJ6k

Alternative :
1. Google Cloud Storage
2. Azure Blob Storage
3. Firebase Storage
4. cloudflare
5. imgix
6. cloudimage
*/


const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
