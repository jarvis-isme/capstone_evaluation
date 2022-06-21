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
  if (!decodedToken) return response;

  //check user exist
  const user = await User.findOne({
    where: { email: decodedToken.email, campus_id: idCampus },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  if (user) {
    const payload = {
      email: user.email,
    };
    const accessToken = await generateAccessToken(payload);
    const roles = await UserRole.findOne({
      where: {
        user_id: user.id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    response = {
      AccessToken: accessToken,
      User: {
        Id: user.id,
        Gender: user.gender,
        Roles: [{ RoleId: roles.roleId }],
        Phone: user.phone,
        Birthday: user.birthday,
        CampusId: user.campus_id,
        Email: user.email,
        Code: user.code,
        Name: user.name,
      },
    };
  }
  return response;
};

module.exports = {
  login,
};
