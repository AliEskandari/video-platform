import {
  createUserWithEmailAndPassword,
  deleteUser as deleteAuthUser,
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../lib/firebase";

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ===========================================
// Auth
// ===========================================

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

  await setDoc(doc(db, "users", createdUserResult.user.uid), {
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
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email.toLowerCase(),
      following: [],
      followers: [],
      dateCreated: Date.now(),
    });
  }
}

// ===========================================
// Users
// ===========================================

// get user from the firestore where userId === userId (passed from the )
export async function getUserById(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id: userId };
  } else {
    // doc.data() will be undefined in this case
    return null;
  }
}

export async function doesEmailExist(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.length > 0;
}

export async function deleteUser(authUser) {
  // storage: delete user's folder
  const storageRef = ref(storage, `videos/${authUser.uid}`);
  await deleteFolder(storageRef);

  // firestore: delete video docs linked to user
  // TODO: Use a cloud function -
  // https://cloud.google.com/firestore/docs/solutions/delete-collections

  // firestore: delete user doc
  await deleteDoc(doc(db, "users", authUser.uid));

  // auth: delete user in auth system
  try {
    await deleteAuthUser(authUser);
  } catch (error) {
    switch (error.code) {
      case "auth/requires-recent-login":
        // User needs to re-authenticate to delete auth account
        // TODO(you): prompt the user to re-provide their sign-in credentials
        // const credential = promptForCredentials();
        // await reauthenticateWithCredential(authUser, credential);
        break;
    }
  }
}

// ===========================================
// Videos
// ===========================================

export async function uploadVideo(userDoc, file, video, onProgress, onDone) {
  const metadata = {
    contentType: file.type,
  };

  // upload file
  const storageRef = ref(storage, `videos/${userDoc.docId}/${file.name}`);
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
        debugger;
        // add doc to video collection
        const videoRef = await addDoc(collection(db, "videos"), {
          title: video.title,
          description: video.description,
          exclusive: video.exclusive,
          dateCreated: Date.now(),
          url: downloadURL,
          views: 0,
          userName: userDoc.name,
          userId: userDoc.id,
        });

        await setDoc(doc(db, `users/${userDoc.docId}/videos`, videoRef.id), {
          docId: videoRef.id,
        });

        onDone();
      });
    }
  );
}

export async function getVideosByUserId(userId) {
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

// ===========================================
// Storage
// ===========================================

/**
 * Deletes all objects in a user's folder in storage. Will do nothing if the user
 * doesn't have a folder.
 *
 * @param {} storageRef
 * @returns {Promise}
 */
async function deleteFolder(storageRef) {
  const listRef = await listAll(storageRef);
  const promises = listRef.items.map((item) => {
    return deleteObject(item);
  });
  return Promise.all(promises);
}
