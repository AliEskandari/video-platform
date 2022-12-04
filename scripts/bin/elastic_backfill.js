require("dotenv").config();

const elastic = require("../lib/elastic");
const engineName = "domum-gym-engine";
const firebase = require("../lib/firebase");
const db = firebase.firestore();

async function backfillVideoDocs() {
  async function indexVideo(snap) {
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
    } = snap.data();

    const doc = {
      id: snap.id,
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

    return elastic
      .indexDocuments(engineName, [doc])
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  const videos = await db.collection("videos").get();
  const promises = videos.docs.map((videoSnap) => {
    return indexVideo(videoSnap);
  });
  const results = await Promise.all(promises);
  console.log("done");
}

backfillVideoDocs();
