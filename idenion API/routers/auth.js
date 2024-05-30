const express = require("express");
const router = express.Router();
const { login, signup, verify } = require("../controllers/auth.js");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/verify/:token").get(verify);

module.exports = router;
