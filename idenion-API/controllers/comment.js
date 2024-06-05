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
  const sql = "UPDATE comments SET likes = likes + 1 WHERE id = $1";
  try {
    await db.query(sql, [commentId]);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error while like comment",
    });
  }
  res.status(StatusCodes.OK).json({ message: "comment like success" });
};

const getAllCommentByIdeaId = async (req, res) => {
  const ideaId = req.params.ideaId;
  const sql =
    "SELECT * FROM comments WHERE ideaid = $1 ORDER BY likes DESC, commentdate DESC";
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
