const functions = require("firebase-functions");
const firebaseTools = require("firebase-tools");
const admin = require("firebase-admin");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
admin.initializeApp();

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.generateThumbnail = functions
  .region("us-west3")
  .storage.object()
  .onFinalize(async (object) => {
    console.log("hello");
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket. => /videos/:user_id/sample.mp4
    const contentType = object.contentType; // File content type.
    const videoDocId = object.metadata.docId;
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    // Exit if this is triggered on a file that is not an video.
    if (!contentType.startsWith("video/")) {
      return functions.logger.log("This is not an video.");
    }

    // Get the file name.
    const fileName = path.basename(filePath); // => sample.mp4
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith("thumb_")) {
      return functions.logger.log("Already a Thumbnail.");
    }

    // [START thumbnailGeneration]
    // Download file from bucket.
    const bucket = admin.storage().bucket(fileBucket);
    const tempVideoFilePath = path.join(os.tmpdir(), fileName); // => /tmp/sample.mp4
    const metadata = {
      contentType: "image/jpeg",
    };

    await bucket.file(filePath).download({ destination: tempVideoFilePath });
    functions.logger.log("Video downloaded locally to", tempVideoFilePath);

    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `thumb_${path.parse(fileName).name}.jpeg`; // => thumb_sample.jpg
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName); // => /videos/:userId/thumb_sample.jpg
    const tempThumbFilePath = path.join(os.tmpdir(), thumbFileName); // => /tmp/thumb_sample.jpg

    // Generate a thumbnail using ImageMagick.
    await spawn("ffmpeg", [
      "-ss",
      "00:00:01.00",
      "-i",
      tempVideoFilePath,
      "-vframes",
      "1",
      tempThumbFilePath,
    ]);

    functions.logger.log("Thumbnail created at", tempThumbFilePath);

    // Uploading the thumbnail.
    const file = await bucket.upload(tempThumbFilePath, {
      destination: thumbFilePath,
      metadata: metadata,
      predefinedAcl: "publicRead",
    });

    const url = file[0].metadata.mediaLink;

    await admin.firestore().collection("videos").doc(videoDocId).update({
      thumbUrl: url,
      thumbFileName: thumbFileName,
    });

    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    fs.unlinkSync(tempVideoFilePath);
    return fs.unlinkSync(tempThumbFilePath);
    // [END thumbnailGeneration]
  });

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
