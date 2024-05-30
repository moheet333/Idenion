const BadRequestError = require("./BadRequestError");
const CustomError = require("./CustomError");
const InternalServerError = require("./InternalServerError");
const AuthorizationError = require("./AuthorizationError");

module.exports = {
  CustomError,
  BadRequestError,
  InternalServerError,
  AuthorizationError,
};
