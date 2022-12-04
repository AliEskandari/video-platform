const functions = require("firebase-functions");
const admin = require("firebase-admin");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");

const db = admin.firestore();
const storage = admin.storage();

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.generateThumbnail = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "8GB",
  })
  .region("us-west3")
  .storage.object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket. => /videos/:user_id/sample.mp4
    const contentType = object.contentType; // File content type.
    const fileName = path.basename(filePath); // => sample.mp4
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    // Exit if this is triggered on a file that is not an video.
    if (!contentType.startsWith("video/")) {
      return functions.logger.log("This is not an video.");
    }

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith("thumb_")) {
      return functions.logger.log("Already a Thumbnail.");
    }

    // Get doc id from metadata
    const videoDocId = object.metadata.docId;

    // [START thumbnailGeneration]
    // Download file from bucket.
    const bucket = storage.bucket(fileBucket);
    const tempVideoFilePath = path.join(os.tmpdir(), fileName); // => /tmp/sample.mp4
    const metadata = {
      contentType: "image/jpeg",
    };

    await bucket
      .file(filePath)
      .download({ destination: tempVideoFilePath, validation: false });
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

    await db.collection("videos").doc(videoDocId).update({
      thumbUrl: url,
      thumbFileName: thumbFileName,
    });

    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    fs.unlinkSync(tempVideoFilePath);
    return fs.unlinkSync(tempThumbFilePath);
    // [END thumbnailGeneration]
  });
