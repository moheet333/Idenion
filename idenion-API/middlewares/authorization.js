const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../errors");

const authorizationMiddleware = async (req, res, next) => {
  if (!req.cookies.user) {
    throw new AuthorizationError("No Token");
  }
  if (typeof req.cookies.user === "string") {
    req.cookies.user = JSON.parse(req.cookies.user);
  }
  const token = req.cookies.user.token;
  try {
    const payload = jwt.verify(token, process.env.JWT);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new AuthorizationError("Invalid Token");
  }
};

module.exports = authorizationMiddleware;
