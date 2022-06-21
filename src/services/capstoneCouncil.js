const CapstoneCoucil = require("../../models/CapstoneCouncil");

// insert or update capstone council
const upsertCaptoneCouncil = async (capstoneCouncilItem, trans) => {
  const [capstoneCouncil, created] = await CapstoneCoucil.upsert(
    capstoneCouncilItem,
    {
      transaction: trans
    }
  );
  return [capstoneCouncil, created];
};

module.exports = {
  upsertCaptoneCouncil
};
