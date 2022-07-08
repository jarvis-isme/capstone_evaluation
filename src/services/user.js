const sequelize = require("../../db");
const Campus = require("../../models/Campus");
const User = require("../../models/User");
const UserRole = require("../../models/UserRole");
const verifyToken = require("../middlewares/verifyFirebase");
const { generateAccessToken } = require("../middlewares/auth");
const Role = require("../../models/Role");
const { QueryTypes } = require("sequelize");

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

    const rawRoles = await UserRole.findAll({
      where: {
        user_id: user.id,
      },
    });
    let roles = [];
    rawRoles.forEach((role) => {
      console.log(role);
      roles.push({
        UserId: role.userId ? role.userId : null,
        RoleId: role.roleId ? role.roleId : null,
        CapstoneTeamId: role.captoneTeamId ? role.captoneTeamId : null,
        CasptoneCouncilId: role.councilTeamId,
      });
    });
    response = {
      AccessToken: accessToken,
      User: {
        Id: user.id,
        Gender: user.gender,
        Roles: roles,
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

// get profile user
const getProfileUser = async (code) => {
  const user = await User.findOne({
    where: { code: code },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (!user) return null;
  return user;
};

// udapte avatar user
const updateAvatarUser = async (avatar, code) => {
  await User.update({ avatar: avatar }, { where: { code: code } });
};

module.exports = {
  login,
  getProfileUser,
  updateAvatarUser,
};
