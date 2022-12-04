const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const { deleteStorageFolder } = require("../storage/helpers");

exports.updateVideosOnUserUpdate = functions
  .region("us-west3")
  .firestore.document("users/{userId}")
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const userData = change.after.data();
    const previousData = change.before.data();

    // only run if name or photoURL has been updated
    if (
      userData.name == previousData.name &&
      userData.photoURL == previousData.photoURL
    ) {
      functions.logger.log("Exiting due to no relevant changes");
      return null;
    }

    // get user videos ids
    console.log("fetching user vids...");
    const videosRef = db.collection(`users/${userId}/videos`);
    const snapshot = await videosRef.get();
    const videoIds = snapshot.docs.map((doc) => doc.id);

    // update each video with new user name and photo url
    videoIds.forEach(async (videoId) => {
      console.log(`updating videoDoc: ${videoId}}`);
      await db.collection("videos").doc(videoId).update({
        userName: userData.name,
        userPhotoURL: userData.photoURL,
      });
    });

    return true;
  });

exports.deleteUser = functions
  .region("us-west3")
  .firestore.document("users/{userId}")
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;

    // delete video files
    console.log("deleting user's video storage folder");
    const videosStoragePath = `videos/${userId}/`;
    await deleteStorageFolder(videosStoragePath);

    // delete images files
    console.log("deleting user's images storage folder");
    const imagesStoragePath = `images/${userId}/`;
    await deleteStorageFolder(imagesStoragePath);

    // get user videos ids
    console.log("fetching user's video ids...");
    const videosRef = db.collection(`users/${userId}/videos`);
    const snapshot = await videosRef.get();
    const videoIds = snapshot.docs.map((doc) => doc.id);

    // delete each video
    videoIds.forEach(async (videoId) => {
      console.log(`deleting video doc: ${videoId}}`);
      await db.collection("videos").doc(videoId).delete();
      await db.collection(`users/${userId}/videos`).doc(videoId).delete();
    });

    return true;
  });
