const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return user;
};

module.exports = {
  getUser
};
