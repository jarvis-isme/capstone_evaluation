const UserRole = require("../../models/UserRole");

// insert user role
const upsertUserRole = async (userRoleItem, trans) => {
  console.log(userRoleItem);
  const userRoleCheck = await UserRole.findAll({
    where: userRoleItem
  });
  if (userRoleCheck.length === 0) {
    await UserRole.create(userRoleItem, {
      transaction: trans
    });
  }
};

module.exports = {
  upsertUserRole
};
