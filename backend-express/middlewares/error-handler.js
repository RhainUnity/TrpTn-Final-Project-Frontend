// error-handler.js - Express error handling middleware

const { isCelebrateError } = require("celebrate");
const { ERROR_MESSAGES } = require("../utils/constants");

function errorHandler(err, req, res) {
  if (isCelebrateError(err)) {
    res.status(400).send({
      message: "Validation failed",
    });
    return;
  }

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? ERROR_MESSAGES.SERVER_ERROR : message,
  });
}

module.exports = errorHandler;
