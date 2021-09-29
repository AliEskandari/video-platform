import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
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

  return user;
}

export async function doesEmailExist(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.length > 0;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!doesEmailExist(user.email)) {
    // firebase user collection (create a document)
    await addDoc(collection(db, "users"), {
      userId: user.uid,
      fullName: user.displayName,
      emailAddress: user.email.toLowerCase(),
      following: [],
      followers: [],
      dateCreated: Date.now(),
    });
  }
}

export async function uploadVideo(userDoc, file, video, setAlert, closeAlert) {
  // Create the file metadata
  const metadata = {
    contentType: file.type,
  };

  // Upload file and metadata to the object
  const storageRef = ref(storage, `videos/${userDoc.uid}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      const message = "Uploading video..." + progress.toFixed(0) + "% done";
      console.log(message);
      setAlert(message);
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

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      setAlert("Uploading video...done", true);

      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);
        // Add doc to video collection
        await addDoc(collection(db, "videos"), {
          title: video.title,
          description: video.description,
          exclusive: video.exclusive,
          dateCreated: Date.now(),
          url: downloadURL,
          user: userDoc.docId,
        });
      });
    }
  );
}
