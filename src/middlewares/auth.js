require("dotenv").config;
const jwt = require("jsonwebtoken");
const { error } = require("./respone");
const User = require("../../models/User");

const getUserByEmail = async (_email) => {
  const user = await User.findOne({
    where: {
      email: _email,
    },
  });
  return user;
};
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .send(
        error(
          (message = "A token is required for authentication"),
          (statusCode = 403)
        )
      );
  }
  try {
    console.log(token);
    const decoded = jwt.verify(
      token.split(" ")[1],
      `${process.env.SECRET_KEY}`
    );
    const user = await getUserByEmail(decoded.payload.email);
    req.user = user;
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .send(error((message = "Invalid token"), (statusCode = 401)));
  }
  console.log("Pass");
  return next();
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
