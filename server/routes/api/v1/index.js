const express = require("express");

const router = express.Router();
const verifyJWT = require("@/middleware/auth/verifyJWT");


//* Public routes
//? Authentication : who the user is
router.use("/test", require("./test"));
router.use("/auth", require("./auth"));

//? Authorization: what the user is allowed to access
//* Protected routes : will check for a valid JWT in the Authorization header, (Authorization: Bearer <token>)
//*  and if it's present, the user will be allowed to access
// router.use(verifyJWT);
// router.use("/users", require("./users"));
// router.use("/posts", upload.array("picture", 25), require("./posts"));

module.exports = router;
