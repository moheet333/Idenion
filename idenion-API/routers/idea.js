const express = require("express");
const router = express.Router();
const {
  publishIdea,
  getSingleIdea,
  filterIdeas,
} = require("../controllers/idea.js");
const {
  getS3PutObjectUrl,
  getS3GetObjectUrl,
  filterMiddleware,
} = require("../middlewares");

router.route("/publishIdea").post(getS3PutObjectUrl, publishIdea);
router.route("/getSingleIdea/:ideaId").get(getS3GetObjectUrl, getSingleIdea);
router.route("/filterIdeas").get(filterMiddleware, filterIdeas);

module.exports = router;
