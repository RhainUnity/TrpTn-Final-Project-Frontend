// error-handler.js - Express error handling middleware

function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });

  next();
}

module.exports = errorHandler;
