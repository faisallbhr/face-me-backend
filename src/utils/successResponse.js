const successResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

module.exports = successResponse;
