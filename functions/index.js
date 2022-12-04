const admin = require("firebase-admin");
admin.initializeApp();

exports.stripe = require("./src/stripe");
exports.firestore = require("./src/firestore");
exports.storage = require("./src/storage");
exports.hosting = require("./src/hosting");
exports.elastic = require("./src/elastic");
