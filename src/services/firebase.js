import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../lib/firebase";

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const user = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));

  return user; // => [{}] if found or [] if no user found
}

export async function doesEmailExist(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.length > 0;
}

export async function signUpWithEmailAndPassword(email, password, name) {
  const createdUserResult = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // set display name to user's full name
  await updateProfile(createdUserResult.user, {
    displayName: name,
  });

  await addDoc(collection(db, "users"), {
    userAuthId: createdUserResult.user.uid,
    name,
    email: email.toLowerCase(),
    following: [],
    followers: [],
    dateCreated: Date.now(),
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!doesEmailExist(user.email)) {
    // firebase user collection (create a document)
    await addDoc(collection(db, "users"), {
      userAuthId: user.uid,
      name: user.displayName,
      email: user.email.toLowerCase(),
      following: [],
      followers: [],
      dateCreated: Date.now(),
    });
  }
}

export async function uploadVideo(userDoc, file, video, onProgress, onDone) {
  const metadata = {
    contentType: file.type,
  };

  // upload file
  const storageRef = ref(storage, `videos/${userDoc.uid}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // listen for state changes, errors, and completion of the upload
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // calculate progress
      const progress = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      const message = "Uploading video..." + progress + "% done";
      console.log(message);
      onProgress(progress);

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // upload complete, get download url
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);
        // add doc to video collection
        await addDoc(collection(db, "videos"), {
          title: video.title,
          description: video.description,
          exclusive: video.exclusive,
          dateCreated: Date.now(),
          url: downloadURL,
          userId: userDoc.userId,
          views: 0,
          userName: userDoc.name,
          userId: userDoc.docId,
        });

        await onDone();
      });
    }
  );
}

export async function getUserVideosByUserId(userId) {
  const q = query(collection(db, "videos"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const videos = querySnapshot.docs.map((video) => ({
    ...video.data(),
    docId: video.id,
  }));
  return videos;
}

export async function getVideoById(videoId) {
  const docRef = doc(db, "videos", videoId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    return null;
  }
}
