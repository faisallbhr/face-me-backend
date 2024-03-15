const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ApiError(401, "Unauthenticated");
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET;

  try {
    const jwtDecode = jwt.verify(token, secret);
    req.user = jwtDecode;
  } catch (error) {
    throw new ApiError(401, "Token is not valid");
  }
  next();
};

module.exports = auth;
