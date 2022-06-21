const admin = require("../../authFirebase");
const verifyToken = async (token) => {
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (e) {}
  return decodedToken;
};

module.exports = verifyToken;
