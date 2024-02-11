/*
See :
1. https://github.com/xhumaliosmani/cloudinary-upload-image-tutorial/blob/main/controller/routeUpload.js
2. https://www.youtube.com/watch?v=3Gj_mL9JJ6k
3. https://www.bing.com/videos/riverview/relatedvideo?&q=cloudinary+image+uploader+with+node+james&&mid=DA2E19EED2C88C7FAD5FDA2E19EED2C88C7FAD5F&&FORM=VRDGAR
4. https://www.youtube.com/watch?v=Rw_QeJLnCK4
Alternative :
1. Google Cloud Storage
2. Azure Blob Storage
3. Firebase Storage
4. cloudflare
5. imgix
6. cloudimage
*/


const cloudinary = require("cloudinary").v2;
const { ENV } = require("@/validations/envSchema");

cloudinary.config({
	cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
	api_key: ENV.CLOUDINARY_API_KEY,
	api_secret: ENV.CLOUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
