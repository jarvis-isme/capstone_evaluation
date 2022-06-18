const sequelize = require("../../db");
const Campus = require("../../models/Campus");
const User = require("../../models/User");
const UserRole = require("../../models/UserRole");
const verifyToken = require("../middlewares/verifyFirebase");
const { generateAccessToken } = require("../middlewares/auth");
const Role = require("../../models/Role");

//login
const login = async (idCampus, idToken) => {
  let response = null;
  //verify token firebase
  const decodedToken = await verifyToken(idToken);

  //check user exist
  const user = await User.findOne({
    where: { email: decodedToken.email, campus_id: idCampus },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (user) {
    const payload = {
      email: user.email,
    };
    console.log(decodedToken);
    const accessToken = await generateAccessToken(payload);
    const roles = await UserRole.findAll({
      where: {
        user_id: user.id,
        capstone_team_id: null,
        capstone_council_id: null,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    response = {
      accessToken: accessToken,
      user: user,
      roles: roles,
    };
  }
  return response;
};

module.exports = {
  login,
};
