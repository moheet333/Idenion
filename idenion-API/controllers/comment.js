const db = require("../db/connect.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const addComment = async (req, res) => {
  const { body, ideaId } = req.body;
  if (!body || !ideaId) {
    throw new BadRequestError("Please provide body and idea id");
  }
  const sql = "INSERT INTO comments (body, userId, ideaId) VALUES ($1,$2,$3);";
  try {
    await db.query(sql, [body, req.user.userId, ideaId]);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error commenting",
    });
  }
  res.status(StatusCodes.CREATED).json({ message: "comment add success" });
};

const likeComment = async (req, res) => {
  const { commentId } = req.body;
  if (!commentId) {
    throw new BadRequestError("Please provide comment id");
  }
  const sqlForUser = "SELECT likes FROM comments WHERE commentId = $1";
  try {
    const data = await db.query(sqlForUser, [commentId]);
    const containsOrNot = data.rows[0].likes.includes(req.user.userId);
    if (containsOrNot) {
      const sql =
        "UPDATE comments SET likes = array_remove(likes, $1) WHERE commentId = $2";
      await db.query(sql, [req.user.userId, commentId]);
      return res.status(StatusCodes.OK).json({
        message: "comment like success",
        like: false,
        userId: req.user.userId,
      });
    } else {
      const sql =
        "UPDATE comments SET likes = array_append(likes, $1) WHERE commentId = $2";
      await db.query(sql, [req.user.userId, commentId]);
      return res.status(StatusCodes.OK).json({
        message: "comment like success",
        like: true,
        userId: req.user.userId,
      });
    }
    return res.status(StatusCodes.OK).json({ message: "comment like success" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error while like comment",
    });
  }
};

const getAllCommentByIdeaId = async (req, res) => {
  const ideaId = req.params.ideaId;
  const sql =
    "SELECT comments.commentId, comments.body, comments.likes, users.name FROM comments INNER JOIN users ON comments.userId = users.id WHERE comments.ideaId = $1 ORDER BY COALESCE(array_length(comments.likes, 1), 0) DESC, comments.commentdate DESC;";
  try {
    const data = await db.query(sql, [Number(ideaId)]);
    return res.status(StatusCodes.OK).json(data.rows);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching comments",
    });
  }
};

module.exports = {
  addComment,
  likeComment,
  getAllCommentByIdeaId,
};
