const express = require("express");

const router = express.Router();
const verifyJWT = require("@/middleware/auth/verifyJWT");
const { isDev } = require("@config/const");
const { checkUserId } = require("@middleware/access/checkUserId");

//* Public routes

isDev && router.use("/test", require("./test"));
router.use("/auth", require("./auth"));

//* Protected routes : will check for a valid JWT in the Authorization header, (Authorization: Bearer <token>)
//*  and if it's present, the user will be allowed to access

router.use(verifyJWT);
router.use("/users", checkUserId, require("./users"));
// router.use("/posts", upload.array("picture", 25), require("./posts"));

module.exports = router;
