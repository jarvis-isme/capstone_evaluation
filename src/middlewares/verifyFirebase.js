const admin = require("../../authFirebase");
const verifyToken = async (token) => {
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken;
};

module.exports = verifyToken;
