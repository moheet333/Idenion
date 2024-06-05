const express = require("express");
const router = express.Router();
const {
  addComment,
  likeComment,
  getAllCommentByIdeaId,
} = require("../controllers/comment.js");

router.route("/addComment").post(addComment);
router.route("/likeComment").patch(likeComment);
router.route("/getAllCommentByIdeaId/:ideaId").get(getAllCommentByIdeaId);

module.exports = router;
