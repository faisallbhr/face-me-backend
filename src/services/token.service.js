const prisma = require("../config/prisma");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const tokenTypes = require("../config/token");

const generateToken = (userId, expires, type, secret) => {
  const payload = {
    id: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (userId, token, expires, type) => {
  await prisma.token.upsert({
    where: {
      userId,
      type
    },
    update: {
      token,
      expires
    },
    create: {
      userId,
      token,
      expires,
      type
    }
  });
};

const verifyToken = async (token) => {
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const tokenDoc = await prisma.token.findFirst({
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
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS, process.env.JWT_ACCESS_SECRET);

  const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_MONTHS, "months");
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH, process.env.JWT_REFRESH_SECRET);

  await saveToken(user.id, refreshToken, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

module.exports = {
  verifyToken,
  generateAuthTokens
};
