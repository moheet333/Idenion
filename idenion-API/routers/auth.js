const express = require("express");
const router = express.Router();
const { login, signup, verify, logout } = require("../controllers/auth.js");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/verify/:token").get(verify);
router.route("/logout").post(logout);

module.exports = router;
