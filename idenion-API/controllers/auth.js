const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const db = require("../db/connect.js");
const jwt = require("jsonwebtoken");
const sendMailToVerify = require("../helpers/sendMailToVerify.js");

const login = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email address");
  }
  const sql = "SELECT * FROM users WHERE email = $1";
  const user = await db.query(sql, [email]);
  if (user.rowCount > 0) {
    try {
      const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT, {
        expiresIn: "1h",
      });
      await sendMailToVerify(user.rows[0].email, token);
      res.status(StatusCodes.OK).json({ message: "Please check your email" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error logging in, please try again" });
    }
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Account does not exist" });
  }
};

const signup = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email address");
  }
  const sql = "SELECT * FROM users WHERE email = $1";
  const user = await db.query(sql, [email]);
  if (user.rowCount > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User with this email already exists" });
  }
  try {
    const sql = "INSERT INTO users (email) VALUES ($1)";
    await db.query(sql, [email]);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error signing up, please try again" });
  }
  res.status(StatusCodes.OK).json({ message: "Sign up success" });
};

const verify = async (req, res) => {
  const token = req.params.token;
  try {
    const data = jwt.verify(token, process.env.JWT);
    const newToken = jwt.sign({ userId: data.userId }, process.env.JWT, {
      expiresIn: "30d",
    });
    res.cookie(
      "user",
      { userId: data.userId, token: newToken },
      { maxAge: 30 * 24 * 60 * 60 * 1000 }
    );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Invalid Token" });
  }
  res.send(
    `<div><h1>Verification Success</h1><a href="http://localhost:3000/publishIdea">Visit Publish Idea page</a></div>`
  );
};

module.exports = {
  login,
  signup,
  verify,
};
