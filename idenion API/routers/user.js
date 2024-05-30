const express = require("express");
const { setName, deleteName } = require("../controllers/user.js");
const router = express.Router();

router.route("/setName").patch(setName);
router.route("/deleteName").delete(deleteName);

module.exports = router;
