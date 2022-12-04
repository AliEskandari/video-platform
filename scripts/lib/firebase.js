const admin = require("firebase-admin");

var serviceAccount = require("../../secrets/domumgym-ff54d-firebase-adminsdk-urt5n-803751b9bf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
