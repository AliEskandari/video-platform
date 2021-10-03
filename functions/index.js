const functions = require("firebase-functions");
const firebase_tools = require("firebase-tools");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB",
  })
  .https.onCall(async (data, context) => {
    // Users can delete only their own data
    if (
      !(
        context.auth &&
        context.auth.token &&
        context.auth.token.uid == data.userId
      )
    ) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only delete your own data."
      );
    }

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    await firebase_tools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    return {
      path: path,
    };
  });
