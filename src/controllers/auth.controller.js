const { authService, tokenService } = require("../services");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const successResponse = require("../utils/successResponse");

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  await authService.register(req.body);

  return successResponse(res, 201, null, "Registration successful");
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await authService.login(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  return successResponse(res, 200, { user, tokens }, "Login successfully");
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  return successResponse(res, 200, null, "Logged out successfully");
});

const refreshAuth = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.token);
  return successResponse(res, 200, tokens, null);
});

module.exports = {
  register,
  login,
  logout,
  refreshAuth
};
