const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class InternalServerError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = InternalServerError;
