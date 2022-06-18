require("dotenv").config;
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const getUserByEmail = async (_email) => {
  const user = User.findOne({
    where: {
      email: _email,
    },
  });
  return user;
};
const verifyToken = (req, res, next) => {
  // if (
  //   req.headers &&
  //   req.headers.authorization &&
  //   req.headers.authorization.split(" ")[0] === "Bearer"
  // ) {
  //   jwt.verify(
  //     req.headers.authorization.split(" ")[1],
  //     `${process.env.SECRET_KEY}`,
  //     function (err, decode) {
  //       if (err) req.user = {undefined;}
  //       req.user = decode;
  //       next();
  //     }
  //   );
  // } else {
  //   req.user = undefined;
  //   next();
  // }
};

const generateAccessToken = async (payload) => {
  const accessToken = await jwt.sign(
    {
      payload,
    },
    `${process.env.SECRET_KEY}`,
    {
      expiresIn: `${process.env.EXPIRED_TOKEN}`,
    }
  );
  return accessToken;
};

module.exports = {
  verifyToken,
  generateAccessToken,
};
