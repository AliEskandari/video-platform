const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebaseTools = require("firebase-tools");
const db = admin.firestore();

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
    await firebaseTools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    return {
      path: path,
    };
  });

exports.incrementVideoViews = functions
  .region("us-west3")
  .runWith({
    timeoutSeconds: 30,
  })
  .https.onCall(async (data, context) => {
    const videoId = data.videoId;
    return await db
      .collection("videos")
      .doc(videoId)
      .update({ views: admin.firestore.FieldValue.increment(1) });
  });

exports.likeVideo = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const videoId = data.videoId;
    const userId = data.userId;

    const videoRef = db.collection("videos").doc(videoId);
    const likeRef = db.collection(`users/${userId}/likes`).doc(videoId);
    const dislikeRef = db.collection(`users/${userId}/dislikes`).doc(videoId);

    try {
      await db.runTransaction(async (t) => {
        const videoDoc = await t.get(videoRef);
        const likeDoc = await t.get(likeRef);
        const dislikeDoc = await t.get(dislikeRef);
        const likes = videoDoc.data().likes;
        const dislikes = videoDoc.data().dislikes;

        if (dislikeDoc.exists) {
          // delete dislike
          t.delete(dislikeRef);
          // dec dislikes
          t.update(videoRef, { dislikes: dislikes - 1 });
        }

        if (likeDoc.exists) {
          // delete like
          t.delete(likeRef);
          // dec likes
          t.update(videoRef, { likes: likes - 1 });
        } else {
          // create like
          const newLikeRef = db
            .collection(`users/${userId}/likes`)
            .doc(videoId);

          t.set(newLikeRef, {
            id: videoId,
            createdAt: Date.now(),
          });
          // inc likes
          t.update(videoRef, { likes: likes + 1 });
        }

        return true;
      });

      console.log("Transaction success!");
    } catch (e) {
      console.log("Transaction failure:", e);
    }
  });

exports.dislikeVideo = functions
  .region("us-west3")
  .runWith({
    timeoutSeconds: 30,
  })
  .https.onCall(async (data, context) => {
    const videoId = data.videoId;
    const userId = data.userId;

    const videoRef = db.collection("videos").doc(videoId);
    const likeRef = db.collection(`users/${userId}/likes`).doc(videoId);
    const dislikeRef = db.collection(`users/${userId}/dislikes`).doc(videoId);

    try {
      await db.runTransaction(async (t) => {
        const videoDoc = await t.get(videoRef);
        const likeDoc = await t.get(likeRef);
        const dislikeDoc = await t.get(dislikeRef);
        const likes = videoDoc.data().likes;
        const dislikes = videoDoc.data().dislikes;

        if (likeDoc.exists) {
          // delete like
          t.delete(likeRef);
          // dec likes
          t.update(videoRef, { likes: likes - 1 });
        }

        if (dislikeDoc.exists) {
          // delete dislike
          t.delete(dislikeRef);
          // dec dislikes
          t.update(videoRef, { dislikes: dislikes - 1 });
        } else {
          // create dislike
          const newDislikeRef = db
            .collection(`users/${userId}/dislikes`)
            .doc(videoId);

          t.set(newDislikeRef, {
            id: videoId,
            createdAt: Date.now(),
          });
          // inc dislikes
          t.update(videoRef, { dislikes: dislikes + 1 });
        }
      });

      console.log("Transaction success!");
    } catch (e) {
      console.log("Transaction failure:", e);
    }
  });
