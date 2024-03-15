const prisma = require("../config/prisma");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const generateToken = (userId, expires, secret) => {
  const payload = {
    id: userId,
    iat: moment().unix(),
    exp: expires.unix()
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires) => {
  await prisma.token.upsert({
    where: {
      userId: userId
    },
    update: {
      token,
      expires
    },
    create: {
      userId,
      token,
      expires
    }
  });
};

const saveRefreshToken = async (token, userId, expires) => {
  await prisma.refreshToken.upsert({
    where: {
      userId: userId
    },
    update: {
      token,
      expires
    },
    create: {
      userId,
      token,
      expires
    }
  });
};

const verifyToken = async (token) => {
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const tokenDoc = await prisma.refreshToken.findFirst({
    where: {
      token
    }
  });
  if (!tokenDoc) {
    throw new Error("Token is not valid");
  }
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_DAYS, "days");

  const accessToken = generateToken(user.id, accessTokenExpires, process.env.JWT_ACCESS_SECRET);

  const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_MONTHS, "months");

  const refreshToken = generateToken(user.id, refreshTokenExpires, process.env.JWT_REFRESH_SECRET);

  await saveToken(accessToken, user.id, accessTokenExpires);
  await saveRefreshToken(refreshToken, user.id, refreshTokenExpires);

  return {
    accessToken,
    refreshToken
  };
};

module.exports = {
  verifyToken,
  generateAuthTokens
};
