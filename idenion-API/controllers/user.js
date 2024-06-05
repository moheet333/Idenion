const db = require("../db/connect.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const setName = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide name and id");
  }
  try {
    const sql = "UPDATE users SET name = $1 WHERE id = $2";
    await db.query(sql, [name, req.user.userId]);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error name while updating name" });
  }
  res.status(StatusCodes.OK).json({ message: "Name set success" });
};

const deleteName = async (req, res) => {
  try {
    const sql = "UPDATE users SET name = NULL WHERE id = $1";
    await db.query(sql, [req.user.userId]);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error in deleting name" });
  }
  res.status(StatusCodes.OK).json({ message: "Name delete success" });
};

module.exports = {
  setName,
  deleteName,
};
