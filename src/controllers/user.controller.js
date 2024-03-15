const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const successResponse = require("../utils/successResponse");

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser();
  return successResponse(res, 200, user, "Successfully get user");
});

module.exports = {
  getUser
};
