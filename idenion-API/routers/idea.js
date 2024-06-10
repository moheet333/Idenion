const express = require("express");
const router = express.Router();
const {
  publishIdea,
  getAllIdeas,
  getSingleIdea,
  filterIdeas,
} = require("../controllers/idea.js");
const {
  getS3PutObjectUrl,
  getS3GetObjectUrl,
  filterMiddleware,
  getAllIdeasMiddleware,
} = require("../middlewares");

router.route("/publishIdea").post(getS3PutObjectUrl, publishIdea);
router.route("/getAllIdeas").get(getAllIdeasMiddleware, getAllIdeas);
router.route("/getSingleIdea/:ideaId").get(getS3GetObjectUrl, getSingleIdea);
router.route("/filterIdeas").get(filterMiddleware, filterIdeas);

module.exports = router;
