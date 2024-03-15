const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  if (process.env.NODE_ENV === "production") {
    statusCode = 500;
    message = "Internal Server Error";
  }

  const response = {
    success: false,
    message
  };

  res.status(statusCode).send(response);
};

module.exports = errorHandler;
