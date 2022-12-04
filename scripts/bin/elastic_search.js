require("dotenv").config();

const elastic = require("../lib/elastic");
const engineName = "domum-gym-engine";
const firebase = require("../lib/firebase");
const db = firebase.firestore();

var searchVideos = firebase.functions().httpsCallable("searchVideos");
searchVideos({ text: messageText }).then((result) => {
  // Read result of the Cloud Function.
  var sanitizedMessage = result.data.text;
});
