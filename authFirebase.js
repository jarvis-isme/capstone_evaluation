var admin = require("firebase-admin");

var serviceAccount = require("./se-capstone-project-management-firebase-adminsdk-n20mx-accbf425dd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
