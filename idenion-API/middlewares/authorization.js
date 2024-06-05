const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../errors");

const authorizationMiddleware = async (req, res, next) => {
  const requestHeader = req.headers.authorization;
  if (!requestHeader || !requestHeader.startsWith("Bearer ")) {
    throw new AuthorizationError("No Token");
  }
  const token = requestHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new AuthorizationError("Invalid Token");
  }
};

module.exports = authorizationMiddleware;
