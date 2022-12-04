const functions = require("firebase-functions");
const { elastic, engineName } = require("./elastic");

// Update the search index every time a video is created.
exports.onVideoCreated = functions
  .region("us-west3")
  .firestore.document("videos/{videoId}")
  .onCreate(async (snap, context) => {
    const {
      dateCreated,
      description,
      duration,
      exclusive,
      fileName,
      title,
      url,
      userId,
      userName,
      views,
    } = snap.data();

    const doc = {
      id: context.params.videoId,
      date_created: dateCreated,
      description,
      duration,
      exclusive,
      file_name: fileName,
      title,
      url,
      user_id: userId,
      user_name: userName,
      views,
    };

    // Add to the Elastic index
    elastic
      .indexDocuments(engineName, [doc])
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  });

// Update the search index every time a video is created.
exports.onVideoUpdate = functions
  .region("us-west3")
  .firestore.document("videos/{videoId}")
  .onUpdate(async (change, context) => {
    const {
      dateCreated,
      description,
      duration,
      exclusive,
      fileName,
      title,
      url,
      userId,
      userName,
      views,
      thumbUrl,
      thumbFileName,
      userPhotoURL,
    } = change.after.data();

    const doc = {
      id: context.params.videoId,
      date_created: dateCreated,
      description,
      duration,
      exclusive,
      file_name: fileName,
      title,
      url,
      user_id: userId,
      user_name: userName,
      views,
      thumb_url: thumbUrl,
      thumb_file_name: thumbFileName,
      user_photo_url: userPhotoURL,
    };

    // Add to the Elastic index
    elastic
      .indexDocuments(engineName, [doc])
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  });

exports.onVideoDeleted = functions
  .region("us-west3")
  .firestore.document("videos/{videoId}")
  .onDelete(async (snap, context) => {
    // Add to the Elastic index
    elastic
      .destroyDocuments(engineName, [context.params.videoId])
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  });
