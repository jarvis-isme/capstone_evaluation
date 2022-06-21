const CouncilLocation = require("../../models/CouncilLocation");

// insert user role
const insertCouncilLocation = async (councilLocationItem, trans) => {
  console.log(councilLocationItem);
  const councilLocationCheck = await CouncilLocation.findAll({
    where: councilLocationItem
  });
  if (councilLocationCheck.length === 0) {
    await CouncilLocation.create(councilLocationItem, {
      transaction: trans
    });
  }
};

module.exports = {
  insertCouncilLocation
};
