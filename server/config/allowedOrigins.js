const {isProduction} = require("@config/const");

const whitelistDev = ["http://127.0.0.1:5500", "http://localhost:3000", "http://localhost:3500"];
const whitelistProd = ["https://yourdomain.com"];

const whitelist = isProduction ? whitelistProd : whitelistDev;

module.exports = { whitelist };
