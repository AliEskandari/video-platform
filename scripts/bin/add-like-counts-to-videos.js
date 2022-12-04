require("dotenv").config();
const firebase = require("../lib/firebase");
const db = firebase.firestore();

async function addLikeCountsToVideos() {
  // get videos
  const videos = await db.collection("videos").get();
  // for each video...
  const promises = videos.docs.map((videoSnap) => {
    // set like and dislikes to 0
    return videoSnap.ref.update({ likes: 0, dislikes: 0 });
  });

  // wait for all videos to finish updating
  await Promise.all(promises);
  console.log("done");
}

addLikeCountsToVideos();
