const tokenService = require("./token.service");
const userService = require("./user.service");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");

const register = async (data) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }]
    }
  });

  if (existingUser) {
    if (existingUser.username === data.username) {
      throw new ApiError(400, "Username is already taken");
    } else {
      throw new ApiError(400, "Email is already taken");
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      image: data.image
    }
  });
};

const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(400, "Wrong password");
  }

  return user;
};

const logout = async (userId) => {
  await prisma.token.delete({
    where: {
      userId
    }
  });

  await prisma.refreshToken.delete({
    where: {
      userId
    }
  });
};

const refreshAuth = async (refreshToken) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken);
  const user = await userService.getUser(refreshTokenDoc.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newToken = await tokenService.generateAuthTokens(user);
  return newToken;
};

module.exports = {
  register,
  login,
  logout,
  refreshAuth
};
